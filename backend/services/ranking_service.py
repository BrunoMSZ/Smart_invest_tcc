import pandas as pd
import numpy as np
from typing import List, Dict, Any

try:
    from backend.services.market_service import market_service
    from backend.services.news_service import news_service
except ImportError:
    from services.market_service import market_service
    from services.news_service import news_service


def gerar_ranking_inteligente(top_n: int = 10) -> List[Dict[str, Any]]:
    """
    Gera ranking multi-fatorial consolidado:
    Score Composto = 60% Probabilidade XGBoost + 30% Alinhamento de Tendência + 10% Sentimento FinBERT
    """
    ativos_base = [
        {"ticker": "PETR4", "nome": "Petrobras PN", "setor": "Petróleo e Gás"},
        {"ticker": "VALE3", "nome": "Vale ON", "setor": "Mineração"},
        {"ticker": "ITUB4", "nome": "Itaú Unibanco PN", "setor": "Bancos"},
        {"ticker": "BBAS3", "nome": "Banco do Brasil ON", "setor": "Bancos"},
        {"ticker": "WEGE3", "nome": "WEG ON", "setor": "Bens Industriais"},
        {"ticker": "HGLG11", "nome": "CSHG Logística FII", "setor": "FII Logístico"},
        {"ticker": "KNIP11", "nome": "Kinea Índice de Preços FII", "setor": "FII Papel"},
        {"ticker": "ITSA4", "nome": "Itaúsa PN", "setor": "Holding"},
        {"ticker": "EGIE3", "nome": "Engie Brasil ON", "setor": "Energia Elétrica"},
        {"ticker": "RENT3", "nome": "Localiza ON", "setor": "Aluguel de Veículos"},
        {"ticker": "PRIO3", "nome": "PRIO ON", "setor": "Petróleo e Gás"},
        {"ticker": "B3SA3", "nome": "B3 ON", "setor": "Serviços Financeiros"}
    ]

    ranking_itens = []

    for item in ativos_base:
        ticker = item["ticker"]
        dados_mkt = market_service.obter_dados_ativo(ticker)
        noticias = news_service.buscar_noticias_ativo(ticker, limite=2)
        sentimento = news_service.calcular_indice_humor(noticias)

        prob_ml = dados_mkt.get("prob_ml", 0.5)
        trend_score = 100.0 if dados_mkt.get("ma_21_dist", 0) > 0 and dados_mkt.get("ma_50_dist", 0) > 0 else 50.0
        sent_score = (sentimento + 1.0) * 50.0  # Converte de [-1, 1] para [0, 100]

        score_final = (0.60 * prob_ml * 100) + (0.30 * trend_score) + (0.10 * sent_score)

        ranking_itens.append({
            "ticker": ticker,
            "nome": item["nome"],
            "setor": item["setor"],
            "preco": dados_mkt.get("preco_atual", 0.0),
            "score_final": round(score_final, 1),
            "prob_ml": round(prob_ml, 4),
            "decisao": dados_mkt.get("decisao_sugerida", "NEUTRO"),
            "tendencia": dados_mkt.get("tendencia", "LATERAL"),
            "sentimento_score": round(sentimento, 2)
        })

    # Ordenar por maior score composto
    ranking_itens.sort(key=lambda x: x["score_final"], reverse=True)
    return ranking_itens[:top_n]


def gerar_ranking(df: pd.DataFrame) -> pd.DataFrame:
    """Função compatível com a assinatura histórica do TCC."""
    if df.empty or "data" not in df.columns:
        itens = gerar_ranking_inteligente(10)
        return pd.DataFrame(itens)

    latest_date = df["data"].max()
    latest_df = df[df["data"] == latest_date].copy()

    if "score_final" in latest_df.columns:
        ranking = (
            latest_df
            .groupby("ticker")
            .agg({
                "score_final": "max",
                "pred": "max"
            })
            .reset_index()
            .sort_values("score_final", ascending=False)
            .head(10)
        )
    else:
        ranking = latest_df.sort_values("preco_fechamento", ascending=False).head(10)

    return ranking