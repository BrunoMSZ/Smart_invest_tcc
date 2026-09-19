import yfinance as yf
import pandas as pd


def baixar_ativos(tickers, periodo="10y"):

    frames = []

    for ticker in tickers:

        try:

            print(f"Baixando {ticker}...")

            df = yf.download(
                f"{ticker}.SA",
                period=periodo,
                auto_adjust=False
            )

            # verifica vazio
            if df.empty:
                print(f"Sem dados para {ticker}")
                continue

            df.reset_index(inplace=True)

            print(df.columns)

            # renomeia dinamicamente
            rename_map = {
                "Date": "data",
                "Open": "abertura",
                "High": "maxima",
                "Low": "minima",
                "Close": "preco_fechamento",
                "Adj Close": "adj_close",
                "Volume": "volume"
            }

            df.rename(columns=rename_map, inplace=True)

            # cria adj_close se não existir
            if "adj_close" not in df.columns:
                df["adj_close"] = df["preco_fechamento"]

            df["ticker"] = ticker

            frames.append(df)

            print(f"{ticker} OK")

        except Exception as e:

            print(f"Erro em {ticker}: {e}")

    # proteção
    if len(frames) == 0:
        raise Exception(
            "Nenhum ativo foi carregado."
        )

    final = pd.concat(frames)

    return final