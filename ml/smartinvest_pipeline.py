import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from pypfopt import expected_returns, risk_models
from pypfopt.efficient_frontier import EfficientFrontier

# ==========================================
# MÓDULO 1: MACHINE LEARNING (FINANÇAS COMPORTAMENTAIS)
# Clusterização de Investidores usando K-Means
# ==========================================
def definir_perfil_investidor(dados_usuario):
    """
    Simula uma base de dados de investidores (Idade, Renda, Tolerância a Risco 1-10).
    Usa K-Means para agrupar o usuário em um perfil e definir a volatilidade máxima.
    """
    print("--- MÓDULO 1: Analisando Perfil do Usuário (K-Means) ---")
    # Base de dados fictícia de usuários anteriores para o algoritmo treinar
    # Colunas: [Idade, Renda_Mensal, Score_Tolerancia_Risco]
    X_treino = np.array([
        [25, 3000, 8], [30, 4000, 7], [22, 2000, 9],  # Jovens/Arrojados
        [45, 10000, 4], [50, 12000, 3], [40, 8000, 5], # Meia-idade/Moderados
        [65, 5000, 2], [70, 6000, 1], [60, 4000, 3]   # Aposentados/Conservadores
    ])
    
    # Treinando o K-Means para encontrar 3 perfis distintos
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    kmeans.fit(X_treino)
    
    # Prevendo o cluster do nosso usuário atual
    cluster_usuario = kmeans.predict([dados_usuario])[0]
    
    # Definindo a volatilidade (risco) máxima aceita com base no cluster
    # Essa é a "trava" matemática gerada pelo comportamento
    limites_volatilidade = {
        0: 0.25, # Arrojado: Aceita até 25% de volatilidade ao ano
        1: 0.15, # Moderado: Aceita até 15% de volatilidade ao ano
        2: 0.05  # Conservador: Aceita até 5% de volatilidade ao ano
    }
    
    volatilidade_maxima = limites_volatilidade.get(cluster_usuario, 0.15)
    print(f"Usuário alocado no Cluster {cluster_usuario}.")
    print(f"Volatilidade Máxima Permitida: {volatilidade_maxima * 100}%\n")
    
    return volatilidade_maxima

# ==========================================
# MÓDULO 2: CAMADA DE DADOS E MERCADO
# Coleta de histórico para embasar a matemática
# ==========================================
def obter_dados_mercado(tickers, inicio, fim):
    """
    Baixa os preços de fechamento ajustados usando a API do Yahoo Finance.
    """
    print("--- MÓDULO 2: Coletando Dados de Mercado ---")
    print(f"Baixando histórico de: {', '.join(tickers)}...")
    df = yf.download(tickers, start=inicio, end=fim)['Adj Close']
    
    # Remove colunas com dados faltantes (empresas que não existiam no período todo)
    df.dropna(axis=1, inplace=True)
    print("Dados coletados com sucesso!\n")
    return df

# ==========================================
# MÓDULO 3: OTIMIZAÇÃO (MARKOWITZ E CAPM)
# A inteligência de alocação de pesos
# ==========================================
def otimizar_carteira(precos, volatilidade_max):
    """
    Usa o PyPortfolioOpt para aplicar a Teoria Moderna do Portfólio.
    Calcula os retornos via CAPM e otimiza os pesos respeitando a trava de risco.
    """
    print("--- MÓDULO 3: Otimizando Carteira (Markowitz + CAPM) ---")
    
    # 1. Calcular o retorno esperado usando CAPM (Sharpe, 1964)
    # Assume uma taxa livre de risco (ex: Selic a ~10.5% = 0.105)
    retornos_esperados = expected_returns.capm_return(precos, risk_free_rate=0.105)
    
    # 2. Calcular a Matriz de Covariância (Risco e Correlação - Markowitz, 1952)
    matriz_covariancia = risk_models.sample_cov(precos)
    
    # 3. Inicializar a Fronteira Eficiente
    ef = EfficientFrontier(retornos_esperados, matriz_covariancia)
    
    try:
        # A Mágica: Pede ao algoritmo a carteira com MAIOR retorno possível, 
        # MAS que não ultrapasse a volatilidade que o usuário aguenta.
        pesos_brutos = ef.efficient_risk(target_volatility=volatilidade_max)
        
        # Limpa os pesos (tira valores ínfimos tipo 0.00001 e joga para zero)
        pesos_limpos = ef.clean_weights()
        
        print("\n=== SUGESTÃO DO SMARTINVEST AI ===")
        for ativo, peso in pesos_limpos.items():
            if peso > 0:
                print(f"{ativo}: {peso * 100:.2f}%")
                
        print("\n=== MÉTRICAS DA CARTEIRA ===")
        # Mostra o Retorno Esperado, Risco (Volatilidade) e Índice de Sharpe
        ef.portfolio_performance(verbose=True, risk_free_rate=0.105)
        
    except ValueError as e:
        print(f"Erro na otimização: {e}")
        print("Dica: O mercado pode estar tão volátil que é impossível atingir o risco exigido pelo usuário com esses ativos.")

# ==========================================
# EXECUÇÃO PRINCIPAL (MAIN)
# ==========================================
if __name__ == "__main__":
    # 1. Input do Usuário: [Idade, Renda, Tolerância a Risco (1 a 10)]
    # Mude esses valores para testar! Ex: [25, 5000, 9] (Arrojado) ou [60, 5000, 2] (Conservador)
    dados_novo_usuario = [28, 4500, 8] 
    
    # 2. Definir o limite de risco (ML)
    vol_max = definir_perfil_investidor(dados_novo_usuario)
    
    # 3. Definir o universo de ativos (Tickers da B3 e ETFs)
    # BOVA11.SA (Mercado BR), IVVB11.SA (S&P 500), B5P211.SA (Renda Fixa IPCA), além de ações.
    tickers_mercado = ['BOVA11.SA', 'IVVB11.SA', 'B5P211.SA', 'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'WEGE3.SA', 'EGIE3.SA']
    
    # 4. Baixar dados dos últimos 4 anos
    precos_historicos = obter_dados_mercado(tickers_mercado, inicio="2020-01-01", fim="2024-01-01")
    
    # 5. Otimizar e gerar a recomendação
    otimizar_carteira(precos_historicos, vol_max)