import sys
from pathlib import Path
import pandas as pd
import joblib

# Inicializa paths
_ROOT = Path(__file__).resolve().parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from backend.config.config import BASE_DIR, MODELS_DIR, REPORTS_DIR
from ml.archives.d_functions.ML_hierarq import (
    load_data,
    filter_data,
    create_features,
    add_sector,
    train_sector_model,
    train_stock_model,
    evaluate_model_on_test
)
from ml.score_model import gerar_score
from backend.services.ranking_service import gerar_ranking_inteligente
from backend.services.openrouter_service import openrouter_service
from backend.services.news_service import news_service
from backend.services.market_service import market_service


def main():
    print("==========================================================")
    print("      SMARTINVEST AI - SISTEMA DE IA & ML FINANCEIRO      ")
    print("==========================================================")

    # =========================
    # 1. LOAD DATASET
    # =========================
    print("\n[*] 1. Carregando base de dados histórica da B3...")
    df = load_data()
    print(f"[+] Dataset carregado com sucesso: {df.shape}")

    # Separar em treino (até 2023) e teste (2024 em diante)
    df_train = df[df["data"].dt.year < 2024].copy()
    df_test = df[df["data"].dt.year >= 2024].copy()

    print(f"[+] Registros de Treino (até 2023): {df_train.shape[0]}")
    print(f"[+] Registros de Teste (2024+):     {df_test.shape[0]}")

    # =========================
    # 2. PREPARAÇÃO & TREINO
    # =========================
    print("\n[*] 2. Preparando engenharia de features e setores...")
    df_train["market_sentiment"] = 0
    df_train = filter_data(df_train)
    df_train = create_features(df_train)
    df_train = add_sector(df_train)

    sector_pred = train_sector_model(df_train)
    df_train = df_train.merge(sector_pred, on=["data", "setor"], how="left")
    df_train["sector_pred"] = df_train["sector_pred"].ffill()

    print("\n[*] 3. Treinando modelo preditivo de ações (XGBoost)...")
    df_train, model_stock = train_stock_model(df_train)

    # Salvar modelo treinado em models/xgboost.pkl
    model_path = MODELS_DIR / "xgboost.pkl"
    joblib.dump(model_stock, model_path)
    print(f"[+] 🎉 Modelo XGBoost salvo com sucesso em: {model_path}")

    # =========================
    # 3. AVALIAÇÃO EM TESTE (2024)
    # =========================
    if not df_test.empty:
        print("\n[*] 4. Avaliando modelo na janela Out-of-Sample (Teste 2024)...")
        df_test["market_sentiment"] = 0
        df_test = filter_data(df_test)
        df_test = create_features(df_test)
        df_test = add_sector(df_test)

        df_test = df_test.merge(sector_pred, on=["data", "setor"], how="left")
        df_test["sector_pred"] = df_test["sector_pred"].ffill()

        features = [
            "lag_1", "lag_3", "lag_7", "ma_7", "ma_21", "ma_50",
            "vol_7", "vol_30", "momentum_7", "momentum_30", "rsi",
            "selic", "market_sentiment", "sector_pred",
            "ma_7_gt_ma_21", "ma_21_gt_ma_50", "bullish_trend",
            "high_30", "low_30", "price_position_30"
        ]

        df_test = evaluate_model_on_test(model_stock, df_test, features)
        df_test = gerar_score(df_test)

    # =========================
    # 4. RANKING MULTI-FATORIAL
    # =========================
    print("\n" + "=" * 60)
    print("   TOP ATIVOS RECOMENDADOS - SCORE MULTI-FATORIAL")
    print("=" * 60)
    ranking_top = gerar_ranking_inteligente(top_n=10)
    df_ranking = pd.DataFrame(ranking_top)
    print(df_ranking[["ticker", "nome", "score_final", "prob_ml", "decisao", "tendencia"]])

    # Salvar relatório no diretório reports/
    caminho_csv = REPORTS_DIR / "ranking_top_ativos.csv"
    df_ranking.to_csv(caminho_csv, index=False, encoding="utf-8-sig")
    print(f"\n[+] Tabela de ranking exportada para: {caminho_csv}")

    # =========================
    # 5. TESTE DO ORQUESTRADOR OPENROUTER
    # =========================
    print("\n[*] 5. Testando Orquestrador OpenRouter (Modelos Gratuitos)...")
    ticker_exemplo = "PETR4"
    dados_quant = market_service.obter_dados_ativo(ticker_exemplo)
    noticias = news_service.buscar_noticias_ativo(ticker_exemplo, limite=3)
    sentimento = news_service.calcular_indice_humor(noticias)

    orquestracao = openrouter_service.orquestrar_analise_ativo(
        ticker=ticker_exemplo,
        dados_quantitativos=dados_quant,
        noticias=noticias,
        sentimento_nlp=sentimento
    )

    print(f"\n--- PARECER DE IA GERADO PARA {ticker_exemplo} ({orquestracao.get('modelo_utilizado')}) ---")
    print(orquestracao["sintese_ia"])
    print("=" * 60)
    print("\n[+] PIPELINE COMPLETO EXECUTADO COM SUCESSO!")


if __name__ == "__main__":
    main()