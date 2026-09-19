import os
import sys
import pandas as pd
import numpy as np
import pyarrow.parquet as pq
import yfinance as yf

from sklearn.metrics import classification_report, accuracy_score, roc_auc_score
from xgboost import XGBClassifier

# ==========================================
# 1. ATUALIZADOR AUTOMÁTICO DE DADOS (2025-2026)
# ==========================================
def update_dataset_to_present(df_main):
    print("\n[*] 🔄 INICIANDO ATUALIZADOR INDIVIDUAL SEGURO PARA 2025-2026...")
    
    import pandas as pd
    import numpy as np
    import yfinance as yf
    import os
    import re
    import time
    
    df_main["ticker"] = df_main["ticker"].astype(str).str.replace("$", "", regex=False).str.strip()
    
    ultima_data_base = df_main["data"].max()
    hoje = pd.Timestamp.now().strftime("%Y-%m-%d")
    
    if ultima_data_base >= pd.to_datetime(hoje) - pd.Timedelta(days=3):
        print("[+] A base já está totalmente updated com os dias recentes!")
        return df_main
        
    start_date = (ultima_data_base + pd.Timedelta(days=1)).strftime("%Y-%m-%d")
    print(f"[!] Sua base termina em {ultima_data_base.strftime('%Y-%m-%d')}. Baixando lacuna até {hoje}...")
    
    # 1. Coleta da Taxa Selic Diária
    try:
        url_bc = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json&dataInicial={ultima_data_base.strftime('%d/%m/%Y')}&dataFinal={pd.Timestamp.now().strftime('%d/%m/%Y')}"
        selic_nova = pd.read_json(url_bc)
        selic_nova["data"] = pd.to_datetime(selic_nova["data"], dayfirst=True)
        dict_selic = dict(zip(selic_nova["data"], selic_nova["valor"]))
        print("[+] Selic atualizada coletada com sucesso do BCB.")
    except Exception as e:
        print(f"[-] Erro ao buscar Selic do BCB: {e}. Usando estimativa padrão.")
        dict_selic = {}

    # 2. Mapeamento Filtrado via RegEx (Filtra Opções e Fracionário)
    df_2024 = df_main[df_main["data"] >= "2024-01-01"]
    if df_2024.empty:
        df_2024 = df_main
        
    tickers_brutos = df_2024["ticker"].unique().tolist()
    padrao_b3 = re.compile(r'^[A-Z]{4}(3|4|5|6|11)$')
    tickers_ativos = [t for t in tickers_brutos if padrao_b3.match(str(t).upper())]
    
    total_ativos = len(tickers_ativos)
    print(f"[+] Alvo definido: {total_ativos} ativos reais para varredura individual.")
    
    # 3. Download Ativo por Ativo com Tratamento de Rate Limit Dinâmico
    novas_linhas = []
    sucessos = 0
    
    print("[*] Buscando atualizações de mercado (Ações e FIIs)...")
    for idx, ticker in enumerate(tickers_ativos, 1):
        ticker_yf = f"{ticker}.SA"
        
        # Log visual rápido a cada 25 ativos para não poluir o terminal
        if idx % 25 == 0 or idx == total_ativos:
            print(f"    -> Processados {idx}/{total_ativos} ativos...")
            
        tentativas = 3
        while tentativas > 0:
            try:
                dados_yahoo = yf.download(ticker_yf, start=start_date, end=hoje, progress=False, group_by='ticker', timeout=10)
                
                if not dados_yahoo.empty:
                    # Se o retorno vier com multi-index por segurança do yfinance
                    if isinstance(dados_yahoo.columns, pd.MultiIndex):
                        if ticker_yf in dados_yahoo.columns.levels[0]:
                            df_t = dados_yahoo[ticker_yf].dropna(subset=["Close"]).reset_index()
                        else:
                            break
                    else:
                        df_t = dados_yahoo.dropna(subset=["Close"]).reset_index()
                        
                    for _, row in df_t.iterrows():
                        v_selic = dict_selic.get(pd.to_datetime(row["Date"]), 0.045)
                        novas_linhas.append({
                            "data": row["Date"],
                            "ticker": ticker,
                            "preco_fechamento": row["Close"],
                            "volume": row["Volume"],
                            "selic": v_selic
                        })
                    if not df_t.empty:
                        sucessos += 1
                break # Sucesso, sai do loop de tentativas do ativo atual
                
            except Exception as e:
                erro_str = str(e).lower()
                if "too many requests" in erro_str or "rate limit" in erro_str or "429" in erro_str:
                    print(f"\n[!] Rate limit atingido no ativo {ticker}. Aguardando 5 segundos para respiro...")
                    time.sleep(5)
                    tentativas -= 1
                else:
                    # Ticker inválido ou delisted real no Yahoo Finance
                    break
        
        # Micro delay padrão de segurança entre requisições individuais
        time.sleep(0.05)
        
    df_novos_dados = pd.DataFrame(novas_linhas)
    print(f"\n[+] Varredura concluída. Ativos atualizados com sucesso: {sucessos}/{total_ativos}")
    
    # 4. Concatenação, Validação e Gravação no Parquet
    if not df_novos_dados.empty:
        df_novos_dados = df_novos_dados.drop_duplicates(subset=["data", "ticker"])
        
        for col in df_main.columns:
            if col not in df_novos_dados.columns:
                df_novos_dados[col] = np.nan
                
        df_novos_dados = df_novos_dados[df_main.columns]
        df_consolidado = pd.concat([df_main, df_novos_dados], ignore_index=True)
        df_consolidated = df_consolidado.sort_values(["ticker", "data"]).drop_duplicates(subset=["data", "ticker"]).reset_index(drop=True)
        
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if '__file__' in locals() else "."
        main_path = os.path.join(BASE_DIR, "data", "raw", "dataset_final.parquet")
        if not os.path.exists(os.path.dirname(main_path)):
            main_path = "dataset_final.parquet"
            
        df_consolidated.to_parquet(main_path, index=False)
        print(f"[+] 🎉 SUCESSO: {len(df_novos_dados)} novas linhas históricas integradas com sucesso até 2026!")
        return df_consolidated
    else:
        print("[-] Nenhuma linha nova pôde ser recuperada do Yahoo Finance.")
        return df_main

# ==========================================
# 2. CARREGAMENTO E FILTRAGEM DE SEGURANÇA
# ==========================================
def load_and_prepare_framework():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if '__file__' in locals() else "."
    main_path = os.path.join(BASE_DIR, "data", "raw", "dataset_final.parquet")
    if not os.path.exists(main_path):
        main_path = "dataset_final.parquet"
        
    print(f"[*] Carregando base original do TCC para expansão: {main_path}...")
    df = pq.read_table(main_path).to_pandas()
    df["data"] = pd.to_datetime(df["data"])
    
    # 1. Primeiro atualizamos e injetamos as linhas de 2025/2026 na base bruta
    df = update_dataset_to_present(df)
    
    # 2. SEGUNDO: Ordenamos para que o cálculo das médias móveis seja contínuo (2024 alimenta 2025!)
    print("[*] Ordenando e preparando série temporal contínua para indicadores...")
    df = df.sort_values(["ticker", "data"]).reset_index(drop=True)
    
    return df

def filtrar_liquidez_pos_calculo(df):
    print("[*] Aplicando filtros de consistência e limpando anomalias matemáticas (Infs)...")
    
    # 🚨 O ESCUDO ANTI-CRASH: Transforma qualquer "Infinito" em valor nulo (NaN)
    import numpy as np # Garantindo que o numpy seja chamado
    df = df.replace([np.inf, -np.inf], np.nan)
    
    # Removemos qualquer linha que tenha ficado com dados corrompidos nos indicadores
    features_criticas = ["ma_21_dist", "ma_50_dist", "ma_200_dist", "vol_30", "momentum_63", "rsi", "selic_anual"]
    df = df.dropna(subset=features_criticas)
    
    # Filtros de liquidez e preço (Evitar penny stocks que geram distorções)
    df = df[(df["volume"] > 0) & (df["preco_fechamento"] >= 1.0)]
    
    # Garantir que só usaremos ativos que tenham histórico robusto
    counts = df.groupby("ticker").size()
    df = df[df["ticker"].isin(counts[counts > 500].index)].reset_index(drop=True)
    
    return df
# ==========================================
# 3. ENGENHARIA DE CARACTERÍSTICAS (FEATURES)
# ==========================================
def create_features_and_target(df):
    print("[*] Calculando indicadores em velocidade máxima de hardware...")
    df = df.sort_values(["ticker", "data"]).reset_index(drop=True)
    
    # Tratamento rápido da Selic
    df["selic"] = df["selic"].replace(0, np.nan)
    df["selic"] = df.groupby("ticker")["selic"].ffill().bfill()
    df["selic"] = np.where(df["selic"] > 0.08, 0.05, df["selic"]) 
    
    df["retorno"] = df.groupby("ticker")["preco_fechamento"].pct_change()
    df["selic_anual"] = ((1 + df["selic"] / 100) ** 252 - 1) * 100
    df["selic_anual"] = df["selic_anual"].clip(lower=2.0, upper=20.0)
    df["target_selic_21d"] = (1 + df["selic"] / 100) ** 21 - 1
    
    # 🚨 SUPER UPGRADE: Rolling nativo indexado por grupo (SEM LAMBDA, SEM TRANSPORTE DE MEMÓRIA)
    print("[*] Computando Médias Móveis de 21, 50 e 200 dias (Nativo em C)...")
    # Agrupamos e aplicamos o rolling direto na série de fechamento
    grouped_close = df.groupby("ticker")["preco_fechamento"]
    
    # O .obj nos permite calcular de forma vetorizada mantendo o alinhamento de índices originais
    df["ma_21_dist"] = (df["preco_fechamento"] / grouped_close.rolling(21).mean().reset_index(level=0, drop=True)) - 1
    df["ma_50_dist"] = (df["preco_fechamento"] / grouped_close.rolling(50).mean().reset_index(level=0, drop=True)) - 1
    df["ma_200_dist"] = (df["preco_fechamento"] / grouped_close.rolling(200).mean().reset_index(level=0, drop=True)) - 1
    
    print("[*] Computando Volatilidade e Momentum...")
    df["vol_30"] = df.groupby("ticker")["retorno"].rolling(30).std().reset_index(level=0, drop=True)
    df["momentum_63"] = df.groupby("ticker")["preco_fechamento"].pct_change(63)
    
    print("[*] Computando RSI Vetorizado...")
    df["delta"] = df.groupby("ticker")["preco_fechamento"].diff()
    df["ganho"] = np.where(df["delta"] > 0, df["delta"], 0)
    df["perda"] = np.where(df["delta"] < 0, -df["delta"], 0)
    
    grouped_ganho = df.groupby("ticker")["ganho"]
    grouped_perda = df.groupby("ticker")["perda"]
    
    avg_ganho = grouped_ganho.rolling(14).mean().reset_index(level=0, drop=True)
    avg_perda = grouped_perda.rolling(14).mean().reset_index(level=0, drop=True)
    
    rs = avg_ganho / (avg_perda + 1e-9)
    df["rsi"] = 100 - (100 / (1 + rs))
    
    # Deletar lixo de memória do RSI
    df = df.drop(columns=["delta", "ganho", "perda"])
    
    print("[*] Definindo Alvo Binário Futuro...")
    df["target_preco"] = df.groupby("ticker")["preco_fechamento"].shift(-21)
    df["target_retorno"] = (df["target_preco"] / df["preco_fechamento"]) - 1
    df["target_class"] = np.where(df["target_retorno"] > df["target_selic_21d"], 1, 0)
    
    df = df.dropna(subset=["ma_200_dist", "target_class", "rsi"]).reset_index(drop=True)
    print("[+] Todos os indicadores foram calculados com sucesso!")
    return df

# ==========================================
# 4. VALIDAÇÃO TEMPORAL E MODELAGEM XGBOOST
# ==========================================
def split_temporal_recent(df):
    # Fronteira: Treinamos o passado e validamos rigorosamente no presente (2025-2026)
    data_corte = pd.to_datetime("2024-12-31")
    df_train = df[df["data"] <= data_corte].copy()
    df_test = df[df["data"] > data_corte].copy()
    
    print("\n================ ESTRUTURA TEMPORAL DO TCC ================")
    print(f"[+] Treino Histórico (2010-2024): {df_train.shape[0]} registros")
    print(f"[+] Teste do Presente (2025-2026): {df_test.shape[0]} registros")
    print("===========================================================\n")
    return df_train, df_test

def train_framework(df_train, df_test, features):
    print("[*] Balanceando pesos e treinando o XGBoost Classifier...")
    
    # 🚨 O SEGREDO: Calcular o desbalanceamento histórico para encorajar o modelo
    contagem_zeros = len(df_train[df_train["target_class"] == 0])
    contagem_uns = len(df_train[df_train["target_class"] == 1])
    peso_balanceamento = contagem_zeros / (contagem_uns + 1e-9)
    
    model = XGBClassifier(
        n_estimators=300,
        learning_rate=0.02,
        max_depth=5,
        subsample=0.7,
        colsample_bytree=0.8,
        scale_pos_weight=peso_balanceamento, # Injeção de coragem!
        eval_metric="logloss",
        random_state=42
    )
    model.fit(df_train[features], df_train["target_class"])
    
    df_test["prob_bom"] = model.predict_proba(df_test[features])[:, 1]
    
    # Ajuste do limite de decisão dinâmico (Youden's J ou Mediana das Probabilidades)
    # Em vez de exigir 50%, pegamos o que está acima da média das previsões do próprio modelo
    limite_otimo = df_test["prob_bom"].median() 
    df_test["pred_class"] = np.where(df_test["prob_bom"] >= limite_otimo, 1, 0)
    
    print("================ METRICAS FOCADAS EM 2025/2026 ================")
    print(f"[*] Limite de Decisão Calibrado (Threshold): {limite_otimo*100:.2f}%")
    print(f"[*] Acurácia Recente: {accuracy_score(df_test['target_class'], df_test['pred_class'])*100:.2f}%")
    print(f"[*] ROC-AUC Recente: {roc_auc_score(df_test['target_class'], df_test['prob_bom']):.4f}")
    print("\nRelatório de Classificação Enriquecido:")
    print(classification_report(df_test['target_class'], df_test['pred_class']))
    print("===============================================================\n")
    
    # Retornamos também o limite para a interface usar
    return model, limite_otimo

# ==========================================
# 5. RENDERIZADOR DE ENTRADA DO USUÁRIO
# ==========================================
def interface_tcc(model, limite_otimo, df, features):
    print("\n" + "="*50)
    print("      SISTEMA EXPERIMENTAL QUANTITATIVO (ML 1)     ")
    print("      REGIME DE DADOS COBERTURA ATÉ 2026          ")
    print("="*50)
    while True:
        ticker = input("Digite o ticker para checagem quantitativa (ou SAIR): ").strip().upper()
        if ticker == "SAIR": break
        
        df_ativo = df[df["ticker"] == ticker].sort_values("data")
        if df_ativo.empty:
            print("[-] Papel indisponível ou filtrado por baixa liquidez.\n")
            continue
            
        ultima = df_ativo.iloc[-1]
        X_instancia = pd.DataFrame([ultima[features]])
        prob = model.predict_proba(X_instancia)[0, 1]
        
        print(f"\n📈 ATIVO CONSULTADO: {ticker}")
        print(f"[*] Data da análise: {ultima['data'].strftime('%d/%m/%Y')}")
        print(f"[*] Último Preço Base: R$ {ultima['preco_fechamento']:.2f}")
        print(f"[*] Patamar da Selic Vigente: {ultima['selic_anual']:.2f}% a.a.")
        print(f"[*] Probabilidade Matemática Ajustada: {prob*100:.2f}% (Corte: {limite_otimo*100:.2f}%)")
        
        # Agora a decisão é baseada no limite dinâmico do modelo, não em um número engessado
        if prob >= limite_otimo * 1.05: # 5% acima da média do mercado
            print("🟢 DECISÃO SUGERIDA: COMPRA (ASSIMETRIA POSITIVA E TENDÊNCIA DE ALTA)")
        elif prob >= limite_otimo * 0.95:
            print("🟡 DECISÃO SUGERIDA: AGUARDAR FORA DO ATIVO (NEUTRO / LATERALIZADO)")
        else:
            print("🔴 DECISÃO SUGERIDA: EVITAR ATIVO (TENDÊNCIA DE BAIXA OU PERDA PRA SELIC)")
        print("="*50 + "\n")

if __name__ == "__main__":
    # Carrega e atualiza
    df = load_and_prepare_framework()
    
    # Cria os indicadores usando o passado para preencher o presente de forma contínua
    df = create_features_and_target(df)
    
    # Filtra mantendo a integridade dos dados calculados
    df = filtrar_liquidez_pos_calculo(df)
    
    features = ["ma_21_dist", "ma_50_dist", "ma_200_dist", "vol_30", "momentum_63", "rsi", "selic_anual"]
    
    df_train, df_test = split_temporal_recent(df)
    modelo_final, threshold = train_framework(df_train, df_test, features)
    interface_tcc(modelo_final, threshold, df, features)