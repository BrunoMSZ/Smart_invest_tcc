import requests
from typing import List, Dict, Any
from newspaper import Article


def raspar_artigo_web(url: str) -> Dict[str, Any]:
    """
    Faz o download e parsing de uma notícia a partir de uma URL web.
    """
    try:
        artigo = Article(url, language="pt")
        artigo.download()
        artigo.parse()
        return {
            "titulo": artigo.title,
            "texto": artigo.text,
            "data_publicacao": str(artigo.publish_date) if artigo.publish_date else "",
            "autores": artigo.authors,
            "sucesso": True
        }
    except Exception as exc:
        return {
            "titulo": "",
            "texto": "",
            "data_publicacao": "",
            "autores": [],
            "erro": str(exc),
            "sucesso": False
        }
