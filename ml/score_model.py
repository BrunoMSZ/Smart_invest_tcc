import numpy as np
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler(
    feature_range=(0, 100)
)


def gerar_score(df):

    df["score_prob"] = np.clip(df["pred"].fillna(0.0), 0.0, 1.0) * 100

    df["score_trend"] = (
        df["bullish_trend"].fillna(0).astype(int) * 100
    )

    df["score_sentimento"] = (
        df["market_sentiment"].fillna(0) * 100
    )

    df["score_final_bruto"] = (
        0.6 * df["score_prob"] +
        0.3 * df["score_trend"] +
        0.1 * df["score_sentimento"]
    )

    df["score_final_bruto"] = df["score_final_bruto"].replace(
        [np.inf, -np.inf], np.nan
    )
    df["score_final_bruto"] = np.nan_to_num(
        df["score_final_bruto"],
        nan=0.0,
        posinf=0.0,
        neginf=0.0
    )

    df[["score_final"]] = scaler.fit_transform(
        df[["score_final_bruto"]].astype(float)
    )

    return df
