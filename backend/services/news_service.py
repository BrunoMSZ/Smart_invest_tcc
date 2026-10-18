import time
import re
import requests
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional
import numpy as np

try:
    from backend.config.config import NEWS_API_KEY
except ImportError:
    from config.config import NEWS_API_KEY


class NewsService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or NEWS_API_KEY
        self._finbert_model = None
        self._news_cache: Dict[str, tuple[float, List[Dict[str, Any]]]] = {}
        self._sentiment_cache: Dict[str, Dict[str, Any]] = {}
        self._cache_ttl = 300

    def _obter_modelo_finbert(self):
        if self._finbert_model is None:
            try:
                from transformers import pipeline
                self._finbert_model = pipeline(
                    "sentiment-analysis",
                    model="ProsusAI/finbert"
                )
            except Exception:
                self._finbert_model = False
        return self._finbert_model if self._finbert_model is not False else None

    def analisar_sentimento_texto(self, texto: str) -> Dict[str, Any]:
        if not texto or len(texto.strip()) < 8:
            return {"label": "Neutro", "score": 0.0}

        texto_original = texto.strip()
        cache_key = texto_original.lower()[:200]
        if cache_key in self._sentiment_cache:
            return self._sentiment_cache[cache_key]

        texto_limpo = texto_original.lower()

        positivas = [
            "lucro", "lucros", "alta", "sobe", "subiu", "supera", "recorde",
            "crescimento", "cresce", "avança", "avanca", "forte", "dividendo",
            "dividendos", "compra", "positivo", "expansão", "expansao", "salto",
            "otimismo", "recupera", "ganho", "ganhos", "dispara"
        ]
        negativas = [
            "prejuízo", "prejuizo", "prejuízos", "prejuizos", "queda", "cai",
            "caiu", "recua", "risco", "baixa", "crise", "fraqueza", "investigação",
            "investigacao", "dívida", "divida", "corte", "negativo", "tombo",
            "despenca", "pessimismo", "alerta", "rebaixa", "perda", "perdas"
        ]

        score_p = sum(1 for w in positivas if w in texto_limpo)
        score_n = sum(1 for w in negativas if w in texto_limpo)

        termos_map = {
            "lucro": "profit", "lucros": "profits", "alta": "rise", "sobe": "surges",
            "subiu": "rose", "supera": "exceeds", "recorde": "record", "crescimento": "growth",
            "avança": "advances", "avanca": "advances", "forte": "strong", "dividendo": "dividend",
            "prejuízo": "loss", "prejuizo": "loss", "queda": "drop", "cai": "falls",
            "dívida": "debt", "divida": "debt", "crise": "crisis", "tombo": "plunge",
            "despenca": "plummets", "otimismo": "optimism", "pessimismo": "pessimism"
        }
        adaptado = texto_original
        for pt, en in termos_map.items():
            adaptado = re.sub(rf"\b{pt}\b", en, adaptado, flags=re.IGNORECASE)
        texto_en = adaptado

        modelo = self._obter_modelo_finbert()
        resultado = None
        if modelo:
            try:
                res = modelo(texto_en[:512], truncation=True)[0]
                label_raw = res["label"].lower()
                score_raw = float(res["score"])

                if label_raw == "positive" and score_raw >= 0.60:
                    resultado = {"label": "Positivo", "score": round(score_raw, 3)}
                elif label_raw == "negative" and score_raw >= 0.60:
                    resultado = {"label": "Negativo", "score": round(-score_raw, 3)}
            except Exception:
                pass

        if not resultado:
            if score_p > score_n:
                intensidade = min(0.40 + score_p * 0.15, 0.95)
                resultado = {"label": "Positivo", "score": round(intensidade, 3)}
            elif score_n > score_p:
                intensidade = max(-0.40 - score_n * 0.15, -0.95)
                resultado = {"label": "Negativo", "score": round(intensidade, 3)}
            else:
                resultado = {"label": "Neutro", "score": 0.0}

        self._sentiment_cache[cache_key] = resultado
        return resultado

    def buscar_noticias_mercado(self, limite: int = 10) -> List[Dict[str, Any]]:
        cache_key = f"__mercado_geral__{limite}"
        agora = time.time()
        if cache_key in self._news_cache:
            ts, itens = self._news_cache[cache_key]
            if agora - ts < self._cache_ttl and len(itens) > 0:
                return itens[:limite]

        noticias: List[Dict[str, Any]] = []
        links_vistos = set()
        titulos_vistos = set()

        def _adicionar(item: Dict[str, Any]):
            link = (item.get("link") or item.get("id") or "").strip()
            titulo = (item.get("titulo") or "").strip()
            norm_tit = re.sub(r"\W+", "", titulo.lower())
            if not titulo or norm_tit in titulos_vistos:
                return
            if link and link != "#" and link in links_vistos:
                return
            if link and link != "#":
                links_vistos.add(link)
            titulos_vistos.add(norm_tit)
            noticias.append(item)

        if self.api_key:
            try:
                query = 'Ibovespa OR "mercado financeiro" OR "bolsa de valores" OR (B3 AND (ações OR dividendos OR mercado))'
                url = f"https://newsapi.org/v2/everything?q={query}&language=pt&sortBy=publishedAt&pageSize={min(limite * 2, 25)}&apiKey={self.api_key}"
                resp = requests.get(url, timeout=5)
                if resp.status_code == 200:
                    dados = resp.json()
                    for art in dados.get("articles", []):
                        tit = art.get("title") or ""
                        desc = art.get("description") or tit
                        if not tit:
                            continue
                        sent = self.analisar_sentimento_texto(f"{tit} {desc}")
                        link = art.get("url") or "#"
                        _adicionar({
                            "id": link if link != "#" else f"newsapi-{len(noticias)}",
                            "titulo": tit,
                            "summary": desc[:240] if desc else tit,
                            "fonte": art.get("source", {}).get("name") or "Mercado Financeiro",
                            "data": (art.get("publishedAt") or "")[:10] or "Hoje",
                            "sentiment": sent["label"],
                            "sentiment_score": sent["score"],
                            "link": link
                        })
            except Exception:
                pass

        if len(noticias) < limite:
            try:
                url_rss = "https://news.google.com/rss/search?q=mercado+financeiro+ibovespa+acoes+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419"
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
                resp = requests.get(url_rss, headers=headers, timeout=5)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.content)
                    for item in root.findall("./channel/item"):
                        if len(noticias) >= limite * 2:
                            break
                        tit_el = item.find("title")
                        pub_el = item.find("pubDate")
                        link_el = item.find("link")
                        tit = tit_el.text if tit_el is not None and tit_el.text else ""
                        if not tit:
                            continue
                        fonte = "Google Notícias"
                        if " - " in tit:
                            partes = tit.rsplit(" - ", 1)
                            tit = partes[0]
                            fonte = partes[1]
                        pub_date = pub_el.text[:16] if pub_el is not None and pub_el.text else "Recente"
                        link = link_el.text if link_el is not None and link_el.text else "#"
                        sent = self.analisar_sentimento_texto(tit)
                        _adicionar({
                            "id": link if link != "#" else f"rss-{len(noticias)}",
                            "titulo": tit,
                            "summary": tit,
                            "fonte": fonte,
                            "data": pub_date,
                            "sentiment": sent["label"],
                            "sentiment_score": sent["score"],
                            "link": link
                        })
            except Exception:
                pass

        if len(noticias) < 3:
            for n in self._noticias_padrao_mercado():
                _adicionar(n)

        resultado = noticias[:limite]
        self._news_cache[cache_key] = (agora, resultado)
        return resultado

    def buscar_noticias_ativo(self, ticker: str, limite: int = 5) -> List[Dict[str, Any]]:
        ticker_limpo = ticker.upper().replace(".SA", "").strip()
        if ticker_limpo in ["", "IBOV", "IBOVESPA", "MERCADO", "INDICE"]:
            return self.buscar_noticias_mercado(limite=limite)

        cache_key = f"{ticker_limpo}_{limite}"
        agora = time.time()
        if cache_key in self._news_cache:
            ts, itens = self._news_cache[cache_key]
            if agora - ts < self._cache_ttl and len(itens) > 0:
                return itens[:limite]

        noticias: List[Dict[str, Any]] = []
        links_vistos = set()
        titulos_vistos = set()

        def _adicionar(item: Dict[str, Any]):
            link = (item.get("link") or item.get("id") or "").strip()
            titulo = (item.get("titulo") or "").strip()
            norm_tit = re.sub(r"\W+", "", titulo.lower())
            if not titulo or norm_tit in titulos_vistos:
                return
            if link and link != "#" and link in links_vistos:
                return
            if link and link != "#":
                links_vistos.add(link)
            titulos_vistos.add(norm_tit)
            noticias.append(item)

        if self.api_key:
            try:
                query = f'("{ticker_limpo}" OR "{ticker_limpo} SA") AND (ações OR bolsa OR B3 OR mercado OR dividendo)'
                url = f"https://newsapi.org/v2/everything?q={query}&language=pt&sortBy=publishedAt&pageSize={limite}&apiKey={self.api_key}"
                resp = requests.get(url, timeout=5)
                if resp.status_code == 200:
                    dados = resp.json()
                    for art in dados.get("articles", []):
                        tit = art.get("title") or ""
                        desc = art.get("description") or tit
                        if not tit:
                            continue
                        sent = self.analisar_sentimento_texto(f"{tit} {desc}")
                        link = art.get("url") or "#"
                        _adicionar({
                            "id": link if link != "#" else f"newsapi-{ticker_limpo}-{len(noticias)}",
                            "titulo": tit,
                            "summary": desc[:200] if desc else tit,
                            "fonte": art.get("source", {}).get("name") or "Mercado B3",
                            "data": (art.get("publishedAt") or "")[:10] or "Hoje",
                            "sentiment": sent["label"],
                            "sentiment_score": sent["score"],
                            "link": link
                        })
            except Exception:
                pass

        if len(noticias) < limite:
            try:
                url_rss = f"https://news.google.com/rss/search?q={ticker_limpo}+acoes+mercado+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419"
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
                resp = requests.get(url_rss, headers=headers, timeout=5)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.content)
                    for item in root.findall("./channel/item"):
                        if len(noticias) >= limite:
                            break
                        tit_el = item.find("title")
                        pub_el = item.find("pubDate")
                        link_el = item.find("link")
                        tit = tit_el.text if tit_el is not None and tit_el.text else ""
                        if not tit:
                            continue
                        fonte = "Google Notícias / B3"
                        if " - " in tit:
                            partes = tit.rsplit(" - ", 1)
                            tit = partes[0]
                            fonte = partes[1]
                        pub_date = pub_el.text[:16] if pub_el is not None and pub_el.text else "Recente"
                        link = link_el.text if link_el is not None and link_el.text else "#"
                        sent = self.analisar_sentimento_texto(tit)
                        _adicionar({
                            "id": link if link != "#" else f"rss-{ticker_limpo}-{len(noticias)}",
                            "titulo": tit,
                            "summary": tit,
                            "fonte": fonte,
                            "data": pub_date,
                            "sentiment": sent["label"],
                            "sentiment_score": sent["score"],
                            "link": link
                        })
            except Exception:
                pass

        if not noticias:
            for n in self._noticias_padrao(ticker_limpo):
                _adicionar(n)

        resultado = noticias[:limite]
        self._news_cache[cache_key] = (agora, resultado)
        return resultado

    def calcular_indice_humor(self, noticias: List[Dict[str, Any]]) -> float:
        if not noticias:
            return 0.0

        total_positivo = 0.0
        total_negativo = 0.0
        contagem = len(noticias)

        for n in noticias:
            score = float(n.get("sentiment_score", 0.0))
            if score > 0:
                total_positivo += score
            elif score < 0:
                total_negativo += abs(score)

        indice_humor = (total_positivo - total_negativo) / max(contagem, 1)
        return round(float(np.clip(indice_humor, -1.0, 1.0)), 3)

    def _noticias_padrao_mercado(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "mock-mercado-1",
                "titulo": "Ibovespa ganha tração com fluxo institucional e otimismo sobre balanços",
                "summary": "Investidores repercutem dados econômicos e movimentação de grandes players na B3.",
                "fonte": "InfoMoney",
                "data": "Hoje",
                "sentiment": "Positivo",
                "sentiment_score": 0.65,
                "link": "https://www.infomoney.com.br"
            },
            {
                "id": "mock-mercado-2",
                "titulo": "Petróleo e commodities metálicas influenciam abertura dos índices globais",
                "summary": "Mercado internacional monitora demanda chinesa e decisões de taxas de juros dos bancos centrais.",
                "fonte": "Valor Econômico",
                "data": "Hoje",
                "sentiment": "Neutro",
                "sentiment_score": 0.05,
                "link": "https://valor.globo.com"
            },
            {
                "id": "mock-mercado-3",
                "titulo": "Bancos e pagadoras de dividendos mantêm consistência na composição do índice",
                "summary": "Setor financeiro sustenta projeções sólidas com margens financeiras robustas e baixa inadimplência.",
                "fonte": "Exame",
                "data": "Hoje",
                "sentiment": "Positivo",
                "sentiment_score": 0.55,
                "link": "https://exame.com"
            }
        ]

    def _noticias_padrao(self, ticker: str) -> List[Dict[str, Any]]:
        base_noticias = {
            "PETR4": [
                {"titulo": "Petrobras reporta forte geração de caixa e anuncia distribuição de proventos", "sentiment": "Positivo", "sentiment_score": 0.65, "fonte": "Valor Econômico", "data": "Hoje", "link": "https://valor.globo.com"},
                {"titulo": "Mercado acompanha oscilação do Brent e política de preços de combustíveis", "sentiment": "Neutro", "sentiment_score": 0.05, "fonte": "InfoMoney", "data": "Ontem", "link": "https://www.infomoney.com.br"}
            ],
            "VALE3": [
                {"titulo": "Vale avança em acordos institucionais e reforça metas de sustentabilidade", "sentiment": "Positivo", "sentiment_score": 0.45, "fonte": "Reuters", "data": "Hoje", "link": "https://www.reuters.com"},
                {"titulo": "Demanda de minério na China tem oscilação e impacta cotações globais", "sentiment": "Neutro", "sentiment_score": -0.10, "fonte": "Bloomberg", "data": "Ontem", "link": "https://www.bloomberg.com"}
            ],
            "ITUB4": [
                {"titulo": "Itaú mantém rentabilidade líder com ROE acima de 21% no período", "sentiment": "Positivo", "sentiment_score": 0.80, "fonte": "Exame", "data": "Hoje", "link": "https://exame.com"},
                {"titulo": "Crédito corporativo segue resiliente com baixa inadimplência no setor bancário", "sentiment": "Positivo", "sentiment_score": 0.50, "fonte": "Valor", "data": "Hoje", "link": "https://valor.globo.com"}
            ]
        }

        noticias_especificas = base_noticias.get(ticker)
        if noticias_especificas:
            for i, n in enumerate(noticias_especificas):
                n.setdefault("id", f"mock-{ticker}-{i}")
                n.setdefault("summary", n["titulo"])
                n.setdefault("link", "#")
            return noticias_especificas

        return [
            {
                "id": f"mock-{ticker}-1",
                "titulo": f"Mercado avalia métricas de liquidez e posicionamento operacional de {ticker}",
                "summary": f"Analistas destacam perspectivas de proventos e resiliência financeira para {ticker}.",
                "fonte": "Consenso B3",
                "data": "Recente",
                "sentiment": "Positivo",
                "sentiment_score": 0.40,
                "link": "#"
            }
        ]


news_service = NewsService()
