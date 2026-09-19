import os
import sys
import pandas as pd
import numpy as np
import pyarrow.parquet as pq
import matplotlib.pyplot as plt

from sklearn.metrics import mean_squared_error, r2_score
from xgboost import XGBRegressor

# ==========================================
# 1. CARREGAMENTO E FILTRAGEM RIGOROSA
# ==========================================
def load_data():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if '__file__' in locals() else "."
    path = os.path.join(BASE_DIR, "data", "raw", "dataset_final.parquet")
    
    if not os.path.exists(path):
        path = "dataset_final.parquet"
        
    df = pq.read_table(path).to_pandas()
    print(f"[+] Dataset original carregado: {df.shape}")
    
    df["data"] = pd.to_datetime(df["data"])
    df = df.sort_values(["ticker", "data"]).reset_index(drop=True)
    return df

def filter_data(df):
    # Filtros básicos de sobrevivência
    df = df[df["volume"] > 0]
    df = df[df["preco_fechamento"] > 0]
    
    # 🚨 TRAVA 1: Eliminar Penny Stocks (Ações de centavos distorcem o cálculo de retorno)
    df = df[df["preco_fechamento"] >= 1.0]
    
    # 🚨 TRAVA 2: Filtrar o top 70% de ativos mais líquidos para evitar "ações fantasmas"
    limite_volume = df["volume"].quantile(0.30)
    df = df[df["volume"] > limite_volume]
    
    # Manter apenas ativos com histórico consistente
    counts = df.groupby("ticker").size()
    valid_tickers = counts[counts > 500].index
    df = df[df["ticker"].isin(valid_tickers)].reset_index(drop=True)
    
    print(f"[+] Dataset após filtragem técnica e liquidez: {df.shape}")
    return df

# ==========================================
# 2. ENGENHARIA DE CARACTERÍSTICAS
# ==========================================
def create_features(df):
    print("[*] Computando indicadores técnicos normalizados (Sem Data Leakage)...")
    
    df["retorno"] = df.groupby("ticker")["preco_fechamento"].pct_change()
    
    # Lags e Médias Móveis Estacionárias
    df["lag_1"] = df.groupby("ticker")["retorno"].shift(1)
    df["lag_3"] = df.groupby("ticker")["retorno"].shift(3)
    df["lag_7"] = df.groupby("ticker")["retorno"].shift(7)
    
    df["ma_7_dist"] = df["preco_fechamento"] / df.groupby("ticker")["preco_fechamento"].transform(lambda x: x.rolling(7).mean()) - 1
    df["ma_21_dist"] = df["preco_fechamento"] / df.groupby("ticker")["preco_fechamento"].transform(lambda x: x.rolling(21).mean()) - 1
    df["ma_50_dist"] = df["preco_fechamento"] / df.groupby("ticker")["preco_fechamento"].transform(lambda x: x.rolling(50).mean()) - 1
    
    # Indicadores estruturais adicionais
    df["vol_7"] = df.groupby("ticker")["retorno"].transform(lambda x: x.rolling(7).std())
    df["vol_30"] = df.groupby("ticker")["retorno"].transform(lambda x: x.rolling(30).std())
    df["momentum_7"] = df.groupby("ticker")["preco_fechamento"].pct_change(7)
    df["momentum_30"] = df.groupby("ticker")["preco_fechamento"].pct_change(30)
    
    def calcular_rsi_grupo(precos, window=14):
        delta = precos.diff()
        ganho = delta.clip(lower=0).rolling(window).mean()
        perda = (-delta.clip(upper=0)).rolling(window).mean()
        rs = ganho / (perda + 1e-9)
        return 100 - (100 / (1 + rs))
        
    df["rsi"] = df.groupby("ticker")["preco_fechamento"].transform(calcular_rsi_grupo)
    
    # Alvo: Retorno do próximo dia útil
    df["target_preco"] = df.groupby("ticker")["preco_fechamento"].shift(-21)
    df["target_retorno"] = (df["target_preco"] / df["preco_fechamento"]) - 1
    
    df = df.dropna().reset_index(drop=True)
    
    # Filtro estatístico contra furos de dados / splits não processados
    limite_insano = 0.30
    df = df[(df["retorno"] > -limite_insano) & (df["retorno"] < limite_insano)]
    df = df[(df["target_retorno"] > -limite_insano) & (df["target_retorno"] < limite_insano)]
    
    return df

def add_sector(df):
    df["setor"] = df["ticker"].str[:4]
    return df

# ==========================================
# 3. VALIDAÇÃO TEMPORAL E TREINAMENTO
# ==========================================
def split_temporal(df, percentage=0.8):
    datas_unicas = np.sort(df["data"].unique())
    ponto_corte = datas_unicas[int(len(datas_unicas) * percentage)]
    
    df_train = df[df["data"] < ponto_corte].copy()
    df_test = df[df["data"] >= ponto_corte].copy()
    
    print(f"[+] Divisão Temporal: Treino até {ponto_corte.astype('M8[D]')} | Teste pós corte.")
    return df_train, df_test

def train_models(df_train, df_test, features):
    print("[*] Treinando modelo XGBoost Regressor para prever retornos...")
    
    X_train = df_train[features]
    y_train = df_train["target_retorno"]
    X_test = df_test[features]
    y_test = df_test["target_retorno"]
    
    model = XGBRegressor(
        n_estimators=100,
        learning_rate=0.03,
        max_depth=3,         
        subsample=0.6,
        colsample_bytree=0.6,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    df_test["pred_retorno"] = model.predict(X_test)
    
    rmse = np.sqrt(mean_squared_error(y_test, df_test["pred_retorno"]))
    r2 = r2_score(y_test, df_test["pred_retorno"])
    print(f"| Metrics | RMSE do Teste: {rmse:.4f} | R² do Teste: {r2:.4f}")
    
    return df_test, model

# ==========================================
# 4. MOTOR DE BACKTEST REALISTA (PESO FIXO DE CAIXA)
# ==========================================
def executar_backtest_markowitz(df_test):
    print("[*] Rodando simulação de Backtesting Avançado (Proteção de Capital)...")
    
    df_test_limpo = df_test.drop_duplicates(subset=["data", "ticker"], keep="first").copy()
    datas_teste = np.sort(df_test_limpo["data"].unique())
    resultados_diarios = []
    
    for i in range(len(datas_teste) - 1):
        data_atual = datas_teste[i]
        data_seguinte = datas_teste[i+1] 
        
        dados_dia = df_test_limpo[df_test_limpo["data"] == data_atual]
        dados_seguinte = df_test_limpo[df_test_limpo["data"] == data_seguinte]
        
        if len(dados_dia) < 5 or dados_seguinte.empty: 
            continue
            
        # Seleção estrita do TOP 5 baseado no sinal do fechamento de hoje
        top_ativos = dados_dia.nlargest(5, "pred_retorno")["ticker"].tolist()
        
        # Mapeamento de retornos reais do dia seguinte
        retornos_reais = dados_seguinte[dados_seguinte["ticker"].isin(top_ativos)].set_index("ticker")["retorno"].to_dict()
        
        # 🚨 ALTERAÇÃO CRÍTICA: Cada um dos 5 ativos recebe obrigatoriamente 20% do peso.
        # Se um ativo sumir ou não cotar, o retorno dele é 0 (capital ficou protegido em caixa).
        retorno_carteira = 0.0
        for ativo in top_ativos:
            retorno_carteira += retornos_reais.get(ativo, 0.0) * 0.20
            
        resultados_diarios.append({
            "data": data_seguinte,
            "Retorno_SmartInvest_AI": retorno_carteira,
            "Retorno_Benchmark_Mercado": dados_seguinte["retorno"].mean()
        })
        
    df_backtest = pd.DataFrame(resultados_diarios)
    
    if df_backtest.empty:
        print("[-] Erro crítico: O Backtest gerou um DataFrame vazio.")
        return
        
    df_backtest["Evolucao_IA"] = (1 + df_backtest["Retorno_SmartInvest_AI"]).cumprod()
    df_backtest["Evolucao_Benchmark"] = (1 + df_backtest["Retorno_Benchmark_Mercado"]).cumprod()
    
    ret_ia = df_backtest["Retorno_SmartInvest_AI"]
    sharpe_ratio = (ret_ia.mean() / (ret_ia.std() + 1e-9)) * np.sqrt(252)
    
    print(f"\n================ BACKTEST COMPLEMENTAR (ESTÁVEL) ================")
    print(f"[*] Retorno Total Acumulado IA: {(df_backtest['Evolucao_IA'].iloc[-1] - 1)*100:.2f}%")
    print(f"[*] Retorno Total Acumulado Mercado: {(df_backtest['Evolucao_Benchmark'].iloc[-1] - 1)*100:.2f}%")
    print(f"[*] Índice Sharpe Anualizado da IA: {sharpe_ratio:.4f}")
    print(f"===============================================================\n")
    
    plt.figure(figsize=(10, 5))
    plt.plot(df_backtest["data"], df_backtest["Evolucao_IA"], label=f"SmartInvest AI (Sharpe: {sharpe_ratio:.2f})", color="darkgreen", lw=2)
    plt.plot(df_backtest["data"], df_backtest["Evolucao_Benchmark"], label="Benchmark de Mercado", color="gray", linestyle="--")
    plt.title("Validação Histórica Definitiva - Escopo Acadêmico")
    plt.xlabel("Linha do Tempo")
    plt.ylabel("Evolução do Capital ($)")
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig("resultado_backtesting.png")
    plt.close()
    print("[+] Gráfico definitivo salvo em 'resultado_backtesting.png'!")

# ==========================================
# 5. EXECUÇÃO DO PIPELINE INTEGRADO
# ==========================================
if __name__ == "__main__":
    df = load_data()
    df = filter_data(df)
    df = create_features(df)
    df = add_sector(df)
    
    features_modelo = [
        "lag_1", "lag_3", "lag_7", 
        "ma_7_dist", "ma_21_dist", "ma_50_dist", 
        "vol_7", "vol_30", 
        "momentum_7", "momentum_30", 
        "rsi"
    ]
    
    df_train, df_test = split_temporal(df, percentage=0.8)
    df_test_com_preds, modelo_treinado = train_models(df_train, df_test, features_modelo)
    executar_backtest_markowitz(df_test_com_preds)