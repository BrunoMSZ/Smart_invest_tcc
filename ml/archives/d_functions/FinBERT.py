from transformers import pipeline
from deep_translator import GoogleTranslator
import numpy as np
# Utilizando o FinBERT, um modelo de NLP especializado em mercado financeiro
analisador_sentimento = pipeline("text-classification", model="ProsusAI/finbert")
def calcular_sentimento_noticias(lista_noticias):
    """
    Traduz strings para o inglês as listas de manchetes financeiras e
    retorna a predominância do sentimento para compor o Score de Atratividade
    """
    if not lista_noticias:
        return 0.0
    noticias_traduzidas = []
    for noticia in lista_noticias:
        try:
            # Camada adaptativa de tradução para inglês, com fallback
            # para o texto original em caso de falha
            traducao = GoogleTranslator(source='pt', target='en').translate(noticia)
            noticias_traduzidas.append(traducao)
        except Exception:
            #Fallback
            noticias_traduzidas.append(noticia)
    resultados = analisador_sentimento(noticias_traduzidas)
    total_positivo, total_negativo = 0.0, 0.0
    contagem_validos = len(resultados)
    for res in resultados:
        label = res['label']
        score = res['score']
        # Acumulação isolada das distribuições de probabilidade por classe
        if label == 'positive':
            total_positivo += score
        elif label == 'negative':
            total_negativo += score
    # Cálculo do Índice de Humor Líquido do Ativo [-1.0, +1.0]
    indice_humor = (total_positivo - total_negativo) / contagem_validos
    return float(np.clip(indice_humor, -1.0, 1.0))
#Exemplo de entrada proveniente do Web Scraping
noticias_petr4 =[
    "Lucro da Petrobras supera as expectativas do mercado no terceiro trimestre.",
    "Nova regulamentação governamental pode taxar dividendos da Petrobras no próximo ano."
]
impacto_humor = calcular_sentimento_noticias(noticias_petr4)
print(f"Índice de Humor do Ativo (NLP): {impacto_humor:.3f}")
# Este valor será cruzado posteriormente com algoritmos como XGBoost


# Teste com as mesmas notícias em português
#noticias_exemplo = [
    #"Lucro da empresa supera as expectativas do mercado no terceiro trimestre.",
    #"Nova regulamentação governamental pode taxar dividendos no próximo ano.",
    #"Diretoria da companhia se reúne para discutir metas operacionais de rotina."
#]

noticias_exemplo = [
    "Company profit exceeds market expectations in the third quarter.", # Claramente Positiva
    "New government regulation could tax dividends next year.",          # Claramente Negativa
    "The company's board meets to discuss routine operational goals."   # Neutra
]

indice_final = calcular_sentimento_noticias(noticias_exemplo)
print(f"📊 Índice de Humor Líquido Purificado (NLP Traduzido): {indice_final:+.4f}")