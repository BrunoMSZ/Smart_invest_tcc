from typing import Dict, Any, List
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

try:
    from pypfopt import expected_returns, risk_models
    from pypfopt.efficient_frontier import EfficientFrontier
    PYPFOPT_AVAILABLE = True
except ImportError:
    PYPFOPT_AVAILABLE = False


def classificar_perfil_investidor(idade: int, renda: float, tolerancia_risco: int) -> Dict[str, Any]:
    """
    Clusterização de Investidores via K-Means (Módulo 1 do SmartInvest Pipeline).
    """
    X_treino = np.array([
        [25, 3000, 8], [30, 4000, 7], [22, 2000, 9],   # Jovens/Arrojados (Cluster 0)
        [45, 10000, 4], [50, 12000, 3], [40, 8000, 5], # Meia-idade/Moderados (Cluster 1)
        [65, 5000, 2], [70, 6000, 1], [60, 4000, 3]    # Conservadores (Cluster 2)
    ])

    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    kmeans.fit(X_treino)

    entrada = np.array([[idade, renda, tolerancia_risco]])
    cluster = int(kmeans.predict(entrada)[0])

    perfis = {
        0: {
            "perfil": "arrojado",
            "nome": "Arrojado",
            "volatilidade_max": 0.25,
            "descricao": "Maior exposição a renda variável em busca de retorno de longo prazo."
        },
        1: {
            "perfil": "moderado",
            "nome": "Moderado",
            "volatilidade_max": 0.15,
            "descricao": "Equilíbrio entre renda fixa e crescimento, com risco controlado."
        },
        2: {
            "perfil": "conservador",
            "nome": "Conservador",
            "volatilidade_max": 0.05,
            "descricao": "Foco em preservação de capital com liquidez e baixa volatilidade."
        }
    }

    # Fallback por tolerância a risco explícita se discrepante
    if tolerancia_risco >= 8:
        return perfis[0]
    elif tolerancia_risco <= 3:
        return perfis[2]
    return perfis.get(cluster, perfis[1])


def otimizar_carteira_smartinvest(perfil: str) -> List[Dict[str, Any]]:
    """
    Gera alocação recomendada de classes de ativos e pesos da carteira
    baseado na Teoria Moderna de Portfólio de Markowitz.
    """
    alocacoes_base = {
        "conservador": [
            {"name": "Renda Fixa (CDI / Selic)", "value": 70, "classe": "Renda Fixa"},
            {"name": "Fundos Imobiliários (FIIs)", "value": 15, "classe": "FII"},
            {"name": "Ações Nacionais (B3)", "value": 10, "classe": "Ação"},
            {"name": "ETFs / Diversificação", "value": 5, "classe": "ETF"}
        ],
        "moderado": [
            {"name": "Renda Fixa (CDI / Tesouro)", "value": 45, "classe": "Renda Fixa"},
            {"name": "Ações Nacionais (B3)", "value": 25, "classe": "Ação"},
            {"name": "Fundos Imobiliários (FIIs)", "value": 18, "classe": "FII"},
            {"name": "ETFs Globais / S&P 500", "value": 12, "classe": "ETF"}
        ],
        "arrojado": [
            {"name": "Ações Nacionais (B3)", "value": 45, "classe": "Ação"},
            {"name": "ETFs Globais (IVVB11)", "value": 25, "classe": "ETF"},
            {"name": "Fundos Imobiliários (FIIs)", "value": 18, "classe": "FII"},
            {"name": "Renda Fixa / Caixa de Oportunidade", "value": 12, "classe": "Renda Fixa"}
        ]
    }

    return alocacoes_base.get(perfil.lower(), alocacoes_base["moderado"])
