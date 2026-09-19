import pandas as pd
import requests
from typing import Dict, Any, Optional


def obter_historico_selic(data_inicial: str = "01/01/2010", data_final: Optional[str] = None) -> pd.DataFrame:
    """
    Coleta a série diária da Taxa Selic diretamente da API do Banco Central do Brasil (SGS 1178).
    """
    if data_final is None:
        data_final = pd.Timestamp.now().strftime("%d/%m/%Y")

    url_bc = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json&dataInicial={data_inicial}&dataFinal={data_final}"
    try:
        df = pd.read_json(url_bc)
        df["data"] = pd.to_datetime(df["data"], dayfirst=True)
        df["selic_diaria"] = df["valor"].astype(float)
        return df
    except Exception as exc:
        print(f"[Ingestion] Falha ao coletar Selic do BCB: {exc}")
        return pd.DataFrame(columns=["data", "valor", "selic_diaria"])
