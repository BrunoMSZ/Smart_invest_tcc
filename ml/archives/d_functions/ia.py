from transformers import pipeline

def analisar_sentimento_ia(texto, modelo_ia):
    # 1. Proteção contra textos vazios (paywall ou erro do site)
    if not texto or len(texto.strip()) < 50:
        return [{'label': 'NEUTRO/BLOQUEADO', 'score': 0.0}]

    texto_limpo = texto[:500]
    resultado = modelo_ia(texto_limpo, truncation=True, max_length=128)
    
    # 4. Retorna a resposta com a indentação correta!
    return resultado
# Vai imprimir: [{'label': 'NEG', 'score': 0.98}] -> 98% de certeza que é Negativo!