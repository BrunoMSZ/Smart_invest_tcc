import pandas as pd


def gerar_indice_sentimento(df_news):

    agrupado = (
        df_news
        .groupby(["data", "ticker"])["sentimento"]
        .mean()
        .reset_index()
    )

    agrupado.rename(
        columns={"sentimento": "market_sentiment"},
        inplace=True
    )

    return agrupado