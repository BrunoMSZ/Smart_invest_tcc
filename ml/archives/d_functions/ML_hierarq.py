import os

import pandas as pd
import numpy as np
import pyarrow.parquet as pq

from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    roc_auc_score,
    mean_squared_error
)

from sklearn.ensemble import RandomForestRegressor

from xgboost import XGBClassifier


# =========================
# LOAD DATA
# =========================
def load_data():
    try:
        from backend.config.config import DATA_DIR
        path = DATA_DIR / "raw" / "dataset_final.parquet"
    except ImportError:
        from pathlib import Path
        path = Path(__file__).resolve().parent.parent.parent.parent / "backend" / "data" / "raw" / "dataset_final.parquet"

    df = pq.read_table(str(path)).to_pandas()

    print("Dataset carregado:", df.shape)

    df["data"] = pd.to_datetime(df["data"])

    df = df.sort_values([
        "ticker",
        "data"
    ])

    return df


# =========================
# FILTRO
# =========================

def filter_data(df):

    df = df[df["volume"] > 0]

    df = df[df["preco_fechamento"] > 0]

    df = df[
        df["preco_fechamento"] <
        df["preco_fechamento"].quantile(0.99)
    ]

    counts = df.groupby("ticker").size()

    valid = counts[counts > 500].index

    df = df[df["ticker"].isin(valid)]

    print("Após filtro:", df.shape)

    return df


# =========================
# FEATURES
# =========================

def create_features(df):

    # retorno
    df["retorno"] = (
        df.groupby("ticker")["preco_fechamento"]
        .pct_change()
    )

    # lags
    df["lag_1"] = (
        df.groupby("ticker")["retorno"]
        .shift(1)
    )

    df["lag_3"] = (
        df.groupby("ticker")["retorno"]
        .shift(3)
    )

    df["lag_7"] = (
        df.groupby("ticker")["retorno"]
        .shift(7)
    )

    # médias móveis
    df["ma_7"] = (
        df.groupby("ticker")["preco_fechamento"]
        .transform(lambda x: x.rolling(7).mean())
    )

    df["ma_21"] = (
        df.groupby("ticker")["preco_fechamento"]
        .transform(lambda x: x.rolling(21).mean())
    )

    df["ma_50"] = (
        df.groupby("ticker")["preco_fechamento"]
        .transform(lambda x: x.rolling(50).mean())
    )

    df["ma_7_gt_ma_21"] = (
        df["ma_7"] > df["ma_21"]
    ).astype(int)

    df["ma_21_gt_ma_50"] = (
        df["ma_21"] > df["ma_50"]
    ).astype(int)

    df["bullish_trend"] = (
        (df["ma_7"] > df["ma_21"]) &
        (df["ma_21"] > df["ma_50"])
    ).astype(int)

    # volatilidade
    df["vol_7"] = (
        df.groupby("ticker")["retorno"]
        .transform(lambda x: x.rolling(7).std())
    )

    df["vol_30"] = (
        df.groupby("ticker")["retorno"]
        .transform(lambda x: x.rolling(30).std())
    )

    # momentum
    df["momentum_7"] = (
        df.groupby("ticker")["preco_fechamento"]
        .pct_change(7)
    )

    df["momentum_30"] = (
        df.groupby("ticker")["preco_fechamento"]
        .pct_change(30)
    )

    # RSI
    ganho = df["retorno"].clip(lower=0)

    perda = -df["retorno"].clip(upper=0)

    media_ganho = ganho.rolling(14).mean()

    media_perda = perda.rolling(14).mean()

    rs = media_ganho / media_perda

    df["rsi"] = 100 - (100 / (1 + rs))

    # suporte/resistência 30 dias
    df["high_30"] = (
        df.groupby("ticker")["preco_fechamento"]
        .transform(lambda x: x.rolling(30).max())
    )

    df["low_30"] = (
        df.groupby("ticker")["preco_fechamento"]
        .transform(lambda x: x.rolling(30).min())
    )

    df["price_position_30"] = (
        (df["preco_fechamento"] - df["low_30"]) / 
        (df["high_30"] - df["low_30"])
    )

    # target (30 dias à frente)
    df["target"] = (
        df.groupby("ticker")["preco_fechamento"]
        .shift(-30)
    )

    df = df.dropna()

    return df


# =========================
# SETOR
# =========================

def add_sector(df):

    df["setor"] = df["ticker"].str[:4]

    print("Com setor:", df.shape)

    return df


# =========================
# MODELO SETOR
# =========================

def train_sector_model(df):

    sector_df = (
        df.groupby(["data", "setor"])
        .agg({
            "retorno": "mean",
            "selic": "mean"
        })
        .reset_index()
    )

    sector_df["target"] = (
        sector_df.groupby("setor")["retorno"]
        .shift(-1)
    )

    sector_df = sector_df.dropna()

    print("Sector DF:", sector_df.shape)

    X = sector_df[[
        "retorno",
        "selic"
    ]]

    y = sector_df["target"]

    split = int(len(X) * 0.8)

    X_train = X[:split]
    X_test = X[split:]

    y_train = y[:split]
    y_test = y[split:]

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    mse = mean_squared_error(
        y_test,
        preds
    )

    print("MSE SETOR:", mse)

    sector_df["sector_pred"] = model.predict(X)

    return sector_df[
        ["data", "setor", "sector_pred"]
    ]


# =========================
# MODELO AÇÃO
# =========================

def train_stock_model(df):

    features = [
        "lag_1",
        "lag_3",
        "lag_7",
        "ma_7",
        "ma_21",
        "ma_50",
        "vol_7",
        "vol_30",
        "momentum_7",
        "momentum_30",
        "rsi",
        "selic",
        "market_sentiment",
        "sector_pred",
        "ma_7_gt_ma_21",
        "ma_21_gt_ma_50",
        "bullish_trend",
        "high_30",
        "low_30",
        "price_position_30"
    ]

    df["target_class"] = (
        (df["target"] / df["preco_fechamento"] - 1) > 0.03
    ).astype(int)

    X = df[features]
    y = df["target_class"]

    split = int(len(X) * 0.8)

    X_train = X[:split]
    X_test = X[split:]

    y_train = y[:split]
    y_test = y[split:]

    model = XGBClassifier(
        n_estimators=300,
        learning_rate=0.03,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        use_label_encoder=False,
        eval_metric="logloss"
    )

    model.fit(X_train, y_train)

    probs = model.predict_proba(X_test)[:, 1]
    preds = model.predict(X_test)

    accuracy = accuracy_score(y_test, preds)
    auc = roc_auc_score(y_test, probs)

    print("ACCURACY:", accuracy)
    print("AUC:", auc)

    df.loc[X_test.index, "pred"] = probs
    df.loc[X_test.index, "pred_class"] = preds

    # =========================
    # COMPRA/VENDA
    # =========================

    df["real"] = y
    df["previsto"] = df["pred_class"]

    cm = confusion_matrix(
        df.loc[X_test.index, "real"],
        df.loc[X_test.index, "previsto"]
    )

    print("\nMATRIZ DE CONFUSÃO:")
    print(cm)

    return df, model


def evaluate_model_on_test(model, df_test, features):
    """
    Avaliar modelo treinado em dados de teste
    """
    
    X_test = df_test[features]
    
    if "target" in df_test.columns:
        y_test = (
            (df_test["target"] / df_test["preco_fechamento"] - 1) > 0.03
        ).astype(int)
    else:
        y_test = None
    
    probs = model.predict_proba(X_test)[:, 1]
    preds = model.predict(X_test)
    
    df_test.loc[X_test.index, "pred"] = probs
    df_test.loc[X_test.index, "pred_class"] = preds
    
    if y_test is not None:
        accuracy = accuracy_score(y_test, preds)
        auc = roc_auc_score(y_test, probs)
        
        print("TESTE - ACCURACY:", accuracy)
        print("TESTE - AUC:", auc)
        
        cm = confusion_matrix(y_test, preds)
        print("\nTESTE - MATRIZ DE CONFUSÃO:")
        print(cm)
    
    return df_test