import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error


def add_sector(df: pd.DataFrame) -> pd.DataFrame:
    """Atribui o setor/código base do ativo."""
    df["setor"] = df["ticker"].str[:4]
    return df


def train_sector_model(df: pd.DataFrame):
    """
    Treina modelo Random Forest para prever a dinâmica setorial.
    """
    if "setor" not in df.columns:
        df = add_sector(df)

    sector_df = (
        df.groupby(["data", "setor"])
        .agg({
            "retorno": "mean",
            "selic": "mean"
        })
        .reset_index()
    )

    sector_df["target"] = sector_df.groupby("setor")["retorno"].shift(-1)
    sector_df = sector_df.dropna()

    if sector_df.empty:
        return pd.DataFrame(columns=["data", "setor", "sector_pred"])

    X = sector_df[["retorno", "selic"]]
    y = sector_df["target"]

    split = int(len(X) * 0.8)
    X_train, y_train = X[:split], y[:split]

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    sector_df["sector_pred"] = model.predict(X)
    return sector_df[["data", "setor", "sector_pred"]]
