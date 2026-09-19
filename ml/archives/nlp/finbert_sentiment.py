from transformers import pipeline


modelo_finbert = pipeline(
    "sentiment-analysis",
    model="ProsusAI/finbert"
)


def analisar_sentimento(texto):

    if not texto or len(texto) < 50:
        return 0

    resultado = modelo_finbert(
        texto[:512],
        truncation=True
    )[0]

    label = resultado["label"]
    score = resultado["score"]

    if label == "positive":
        return score

    if label == "negative":
        return -score

    return 0