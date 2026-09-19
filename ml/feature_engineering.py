import numpy as np


def create_features(df):

    df = df.sort_values(["ticker", "data"])

    # retorno
    df["retorno"] = (
        df.groupby("ticker")["preco_fechamento"]
        .pct_change()
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

    # volatilidade
    df["vol_7"] = (
        df.groupby("ticker")["retorno"]
        .transform(lambda x: x.rolling(7).std())
    )

    df["vol_30"] = (
        df.groupby("ticker")["retorno"]
        .transform(lambda x: x.rolling(30).std())
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

    # RSI simplificado
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

    # target futuro (30 dias à frente)
    df["target"] = (
        df.groupby("ticker")["preco_fechamento"]
        .shift(-30)
    )

    df = df.dropna()

    return df