from newspaper import Article
import requests
from youtube_transcript_api import YouTubeTranscriptApi
from youtubesearchpython import VideosSearch

def identificar_tipo_ativo(ticker):
    """
    Se o ticker terminar em '11' (Ex: MXRF11, HGLG11), é um FII.
    Caso contrário, tratamos como Ação (Ex: PETR4, VALE3).
    """
    ticker_limpo = ticker.upper().replace(".SA", "").strip()
    if ticker_limpo.endswith("11"):
        return "FII"
    return "ACAO"

def buscar_id_video_youtube(ticker):
    """
    Simula uma busca no YouTube por uma análise do FII e retorna o ID do primeiro vídeo.
    """
    query_busca = f"Análise Fundo Imobiliário {ticker} vale a pena"
    print(f"🔎 Pesquisando no YouTube automaticamente: '{query_busca}'...")
    
    try:
        busca = VideosSearch(query_busca, limit=1)
        resultado = busca.result()
        
        if resultado['result']:
            video_id = resultado['result'][0]['id']
            titulo = resultado['result'][0]['title']
            print(f"🎬 Vídeo encontrado: {titulo}")
            return video_id
        else:
            print("👻 Nenhum vídeo encontrado no YouTube para este ativo.")
            return None
    except Exception as e:
        print(f"❌ Erro ao buscar no YouTube: {e}")
        return None


def extrair_texto_youtube(video_id):
    """
    Recebe o ID do vídeo e extrai a legenda de forma blindada contra erros de tipagem.
    """
    print(f"▶️ Extraindo legendas do vídeo {video_id}...")
    try:
        # 1. Pede a lista de todas as legendas disponíveis naquele vídeo
        lista_legendas = YouTubeTranscriptApi.list_transcripts(video_id)
        
        try:
            # 2. Tenta pegar a legenda em Português primeiro (manual ou automática)
            transcript = lista_legendas.find_transcript(['pt', 'pt-BR'])
        except:
            # 3. Se não achar PT, pega o primeiro idioma que tiver (ex: Inglês) e TRADUZ pra PT!
            primeira_legenda = list(lista_legendas)[0]
            transcript = primeira_legenda.translate('pt')
            print("🌐 Legenda estrangeira detectada: Traduzindo para o Português automaticamente...")
            
        # 4. Baixa a legenda
        legenda = transcript.fetch()
        
        # 5. A EXTRAÇÃO BLINDADA: Funciona com versões novas (Objeto) e antigas (Dicionário)
        textos = []
        for pedaco in legenda:
            if hasattr(pedaco, 'text'):  # Se a biblioteca retornou um Objeto
                textos.append(pedaco.text)
            elif isinstance(pedaco, dict) and 'text' in pedaco:  # Se retornou um Dicionário
                textos.append(pedaco['text'])
                
        texto_completo = " ".join(textos)
        
        return texto_completo
        
    except Exception as e:
        print(f"❌ Erro ao extrair YouTube: {e}")
        return ""

import pdfplumber

def extrair_texto_pdf(caminho_arquivo_pdf):
    """
    Abre um arquivo PDF local e extrai todo o texto dele.
    """
    print(f"📄 Lendo relatório oficial: {caminho_arquivo_pdf}...")
    texto_completo = ""
    
    try:
        with pdfplumber.open(caminho_arquivo_pdf) as pdf:
            for pagina in pdf.pages:
                texto_extraido = pagina.extract_text()
                if texto_extraido:
                    texto_completo += texto_extraido + " \n"
                    
        return texto_completo
    except Exception as e:
        print(f"❌ Erro ao ler PDF: {e}")
        return ""


def montar_query_newsapi(ticker,nome):
    #Gerar query que evita ruídos
    contexto_financeiro = 'AND ("ações" OR "bolsa" OR "B3" OR "mercado" OR "dividendo" OR "investimentos" OR "finanças" OR "FII")'

    query = f'("{nome}" OR "{ticker}") {contexto_financeiro}'

    return query

def busca_noticias(query,api_key,limite_news = 120):

    print(f"Buscando noticias sobre a query: {query}")
    url_news = f"https://newsapi.org/v2/everything?q={query}&language=pt&sortBy=publishedAt&apiKey={api_key}"
    
    resposta = requests.get(url_news)
    dados = resposta.json()
    
    # Verifica se a NewsAPI deu algum erro (ex: chave inválida)
    if resposta.status_code != 200:
        print(f"❌ Erro na NewsAPI: {dados.get('message')}")
        return []
    artigos_encontrados = dados.get('articles', [])
    print(f"✅ A NewsAPI encontrou {len(artigos_encontrados)} resultados. Extraindo os {limite_news} primeiros...\n")

    noticias_prontas = []

    # 2. Loop para processar apenas o limite que definimos (para não demorar muito)
    for artigo in artigos_encontrados[:limite_news]:
        titulo = artigo.get('title')
        link = artigo.get('url')
        data_pub = artigo.get('publishedAt')
        
        if titulo is None or link is None:
            continue

        print(f"✂️  Limpando site: {titulo[:40]}...")
        
        # 3. A mágica do newspaper3k
        texto_limpo = ""
        try:
            site = Article(link, language='pt')
            site.download()
            site.parse()
            
            # Pega o texto principal
            texto_limpo = site.text
            
            # Se o newspaper3k não achou texto (as vezes é só vídeo ou imagem)
            if not texto_limpo.strip():
                texto_limpo = "[Texto não encontrado ou bloqueado pelo site]"
                
        except Exception as e:
            texto_limpo = f"[Erro ao tentar extrair o texto: {e}]"
            
        # 4. Salva tudo em um pacote organizado
        noticias_prontas.append({
            'titulo': titulo,
            'link': link,
            'data': data_pub,
            'texto_limpo': texto_limpo
        })
        
    return noticias_prontas