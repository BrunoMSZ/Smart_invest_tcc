"""
Módulo de Treinamento e Validação do Modelo XGBoost Preditivo da B3.
Baseado na metodologia quantitativa com 7 features e alvo contra a taxa Selic.
"""
import time
from pathlib import Path
import numpy as np
import pandas as pd
import pyarrow.parquet as pq
import joblib
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report

try:
    from backend.config.config import BASE_DIR, DATA_DIR, MODELS_DIR
except ImportError:
    from config.config import BASE_DIR, DATA_DIR, MODELS_DIR

FEATURES = [
    "ma_21_dist",
    "ma_50_dist",
    "ma_200_dist",
    "vol_30",
    "momentum_63",
    "rsi",
    "selic_anual"
]

def calcular_features_e_target(df: pd.DataFrame) -> pd.DataFrame:
    """Calcula as 7 features quantitativas e o target contra a Selic."""
    df = df.sort_values(["ticker", "data"]).reset_index(drop=True)
    
    # Tratamento da Selic
    df["selic"] = df["selic"].replace(0, np.nan).ffill().bfill()
    df["retorno"] = df.groupby("ticker")["preco_fechamento"].pct_change()
    df["selic_anual"] = ((1 + df["selic"] / 100) ** 252 - 1) * 100
    df["selic_anual"] = df["selic_anual"].clip(lower=2.0, upper=20.0)
    df["target_selic_21d"] = (1 + df["selic"] / 100) ** 21 - 1

    # Médias Móveis
    grouped_close = df.groupby("ticker")["preco_fechamento"]
    df["ma_21_dist"] = (df["preco_fechamento"] / grouped_close.rolling(21).mean().reset_index(level=0, drop=True)) - 1
    df["ma_50_dist"] = (df["preco_fechamento"] / grouped_close.rolling(50).mean().reset_index(level=0, drop=True)) - 1
    df["ma_200_dist"] = (df["preco_fechamento"] / grouped_close.rolling(200).mean().reset_index(level=0, drop=True)) - 1
    
    # Volatilidade e Momentum
    df["vol_30"] = df.groupby("ticker")["retorno"].rolling(30).std().reset_index(level=0, drop=True)
    df["momentum_63"] = df.groupby("ticker")["preco_fechamento"].pct_change(63)

    # RSI (14)
    df["delta"] = df.groupby("ticker")["preco_fechamento"].diff()
    df["ganho"] = np.where(df["delta"] > 0, df["delta"], 0)
    df["perda"] = np.where(df["delta"] < 0, -df["delta"], 0)
    grouped_ganho = df.groupby("ticker")["ganho"]
    grouped_perda = df.groupby("ticker")["perda"]
    avg_ganho = grouped_ganho.rolling(14).mean().reset_index(level=0, drop=True)
    avg_perda = grouped_perda.rolling(14).mean().reset_index(level=0, drop=True)
    rs = avg_ganho / (avg_perda + 1e-9)
    df["rsi"] = 100 - (100 / (1 + rs))

    # Target: superou Selic em 21 dias úteis
    df["target_preco"] = df.groupby("ticker")["preco_fechamento"].shift(-21)
    df["target_retorno"] = (df["target_preco"] / df["preco_fechamento"]) - 1
    df["target_class"] = np.where(df["target_retorno"] > df["target_selic_21d"], 1, 0)

    # Limpeza
    df = df.dropna(subset=FEATURES + ["target_class"]).reset_index(drop=True)
    return df

def treinar_e_salvar_modelo(
    caminho_parquet: Path = None,
    caminho_saida: Path = None,
    top_ativos_liquidos: int = 120
):
    """Treina o modelo XGBoost com validação temporal e salva o arquivo .pkl."""
    if caminho_parquet is None:
        caminho_parquet = DATA_DIR / "raw" / "dataset_final.parquet"
    if caminho_saida is None:
        caminho_saida = MODELS_DIR / "xgboost.pkl"

    print(f"[*] 1. Carregando dados de: {caminho_parquet}...")
    df = pq.read_table(
        str(caminho_parquet),
        columns=["data", "ticker", "preco_fechamento", "volume", "selic"]
    ).to_pandas()
    df["data"] = pd.to_datetime(df["data"])

    # Filtra os ativos mais líquidos para treino robusto
    print(f"[*] 2. Selecionando top {top_ativos_liquidos} ativos mais líquidos...")
    top_tickers = df.groupby("ticker")["volume"].sum().nlargest(top_ativos_liquidos).index.tolist()
    df = df[df["ticker"].isin(top_tickers)].copy()

    print("[*] 3. Computando indicadores e target...")
    df = calcular_features_e_target(df)

    # Split Temporal (Treino < 2024, Teste >= 2024)
    data_corte = pd.to_datetime("2024-01-01")
    df_train = df[df["data"] < data_corte]
    df_test = df[df["data"] >= data_corte]

    print(f"================ ESTRUTURA TEMPORAL ================")
    print(f"[+] Treino Histórico: {len(df_train)} amostras")
    print(f"[+] Teste Recente:    {len(df_test)} amostras")
    print(f"=====================================================")

    # Treino XGBoost Classifier
    print("[*] 4. Treinando XGBClassifier...")
    model = XGBClassifier(
        n_estimators=200,
        learning_rate=0.03,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="logloss",
        random_state=42
    )
    model.fit(df_train[FEATURES], df_train["target_class"])

    # Validação
    preds = model.predict(df_test[FEATURES])
    probs = model.predict_proba(df_test[FEATURES])[:, 1]
    acc = accuracy_score(df_test["target_class"], preds)
    roc = roc_auc_score(df_test["target_class"], probs)

    print("\n================ RESULTADOS DE VALIDAÇÃO ================")
    print(f"[*] Acurácia em Teste (2024+): {acc * 100:.2f}%")
    print(f"[*] ROC-AUC em Teste:          {roc:.4f}")
    print("\nRelatório de Classificação:")
    print(classification_report(df_test["target_class"], preds))
    print("=========================================================\n")

    # Salva modelo
    caminho_saida.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, str(caminho_saida))
    print(f"[+] Modelo XGBoost salvo com sucesso em: {caminho_saida}")
    return model

if __name__ == "__main__":
    treinar_e_salvar_modelo()