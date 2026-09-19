import os
import sys
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

# Garante resolução de imports tanto de backend.* quanto diretos
_ROOT = Path(__file__).resolve().parent.parent.parent
_BACKEND = Path(__file__).resolve().parent.parent
for _p in [str(_ROOT), str(_BACKEND)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

import pandas as pd
from fastapi import FastAPI, HTTPException, Query, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

try:
    from backend.config import BASE_DIR, MODELS_DIR, DATA_DIR, OPENROUTER_API_KEY, OPENROUTER_FREE_MODELS
    from backend.database import (
        init_db, get_db,
        User, Questionario, CarteiraItem, Post, PostLike, Comentario, Grupo, ChatLog, GrupoMensagem,
        hash_password, verify_password, create_access_token, decode_access_token
    )
    from backend.services.openrouter_service import openrouter_service
    from backend.services.market_service import market_service
    from backend.services.news_service import news_service
    from backend.services.ranking_service import gerar_ranking_inteligente
    from backend.services.recommendation_service import (
        classificar_perfil_investidor,
        otimizar_carteira_smartinvest
    )
except ImportError:
    from config import BASE_DIR, MODELS_DIR, DATA_DIR, OPENROUTER_API_KEY, OPENROUTER_FREE_MODELS
    from database import (
        init_db, get_db,
        User, Questionario, CarteiraItem, Post, PostLike, Comentario, Grupo, ChatLog, GrupoMensagem,
        hash_password, verify_password, create_access_token, decode_access_token
    )
    from services.openrouter_service import openrouter_service
    from services.market_service import market_service
    from services.news_service import news_service
    from services.ranking_service import gerar_ranking_inteligente
    from services.recommendation_service import (
        classificar_perfil_investidor,
        otimizar_carteira_smartinvest
    )

# Inicializa banco de dados e seed na subida
init_db()

app = FastAPI(
    title="SmartInvest AI - API Backend",
    description="API de Inteligência Artificial Quantitativa, Persistência com Banco de Dados e Orquestrador OpenRouter",
    version="2.0.0"
)

# ==========================================
# CONFIGURAÇÃO DE CORS PARA O FRONTEND
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# HELPERS DE AUTENTICAÇÃO
# ==========================================
def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Retorna o usuário a partir do Header Bearer Token, ou o primeiro usuário (Rafael) se não autenticado."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            user = db.query(User).filter(User.email == payload["sub"]).first()
            if user:
                return user
    # Fallback para o usuário padrão da plataforma para garantir funcionamento sem fricção
    return db.query(User).filter(User.email == "rafael@aporta.com").first() or db.query(User).first()


def format_user_response(user: User) -> Dict[str, Any]:
    return {
        "id": user.id,
        "name": user.nome,
        "email": user.email,
        "handle": user.handle,
        "initials": user.initials,
        "perfil_investidor": user.perfil_investidor,
        "renda_mensal": user.renda_mensal,
        "idade": user.idade,
        "patrimonio_estimado": user.patrimonio_estimado,
        "avatar_url": user.avatar_url,
        "points": user.pontos,
        "level": user.nivel,
        "levelName": user.nivel_nome,
        "streak": user.sequencia_meses,
        "nextLevelAt": user.proximo_nivel_pontos,
        "badge": user.badge,
        "data_cadastro": user.data_cadastro.strftime("%Y-%m-%d") if user.data_cadastro else "2024-01-01",
        "configuracoes": {
            "notificacoes_email": user.notificacoes_email,
            "alertas_volatilidade": user.alertas_volatilidade
        }
    }


# ==========================================
# MODELOS PYDANTIC DE REQUISIÇÃO E RESPOSTA
# ==========================================
class LoginRequest(BaseModel):
    email: str = Field(..., description="E-mail do usuário")
    senha: str = Field(..., description="Senha do usuário")


class RegisterRequest(BaseModel):
    nome: str = Field(..., description="Nome completo")
    email: str = Field(..., description="E-mail de cadastro")
    senha: str = Field(..., description="Senha")
    idade: Optional[int] = 30
    renda_mensal: Optional[float] = 5000.0
    perfil_investidor: Optional[str] = "moderado"


class ProfileUpdateRequest(BaseModel):
    nome: Optional[str] = None
    idade: Optional[int] = None
    renda_mensal: Optional[float] = None
    perfil_investidor: Optional[str] = None
    patrimonio_estimado: Optional[float] = None
    notificacoes_email: Optional[bool] = None
    alertas_volatilidade: Optional[bool] = None


class ChatMessage(BaseModel):
    role: str = Field(..., description="Papel da mensagem: 'user' ou 'assistant'")
    content: str = Field(..., description="Conteúdo do texto")


class ChatRequest(BaseModel):
    message: str = Field(..., description="Pergunta ou mensagem do usuário")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Histórico prévio da conversa")
    ticker: Optional[str] = Field(default=None, description="Ticker opcional para focar a análise")


class ChatResponse(BaseModel):
    response: str
    model_used: Optional[str] = None
    success: bool
    notice: Optional[str] = None


class QuestionarioRequest(BaseModel):
    idade: int = Field(default=30, ge=18, le=100, description="Idade do usuário")
    renda_mensal: float = Field(default=5000.0, ge=0, description="Renda Mensal em R$")
    respostas_risco: int = Field(default=5, ge=1, le=10, description="Score de tolerância ao risco (1 a 10)")
    profile_override: Optional[str] = Field(default=None, description="Sobrescrever perfil manualmente")



class SmartInvestResponse(BaseModel):
    perfil: str
    nome_perfil: str
    descricao: str
    volatilidade_maxima: float
    alocacao: List[Dict[str, Any]]


class CarteiraItemRequest(BaseModel):
    ticker: str
    nome: Optional[str] = None
    classe: str = "Ação"
    percentual: float = 0.0
    preco_medio: Optional[float] = 0.0
    quantidade: Optional[float] = 0.0
    valor_alocado: Optional[float] = 0.0


class PostCreateRequest(BaseModel):
    conteudo: str = Field(..., min_length=1)
    tag: Optional[str] = "Aporte"
    comprovante: Optional[bool] = False
    comprovante_url: Optional[str] = None


class ComentarioCreateRequest(BaseModel):
    conteudo: str = Field(..., min_length=1)


class GrupoCreateRequest(BaseModel):
    nome: str
    descricao: Optional[str] = None
    meta_mensal: Optional[float] = 500.0
    privado: Optional[bool] = True

class GrupoJoinRequest(BaseModel):
    codigo: str

class GrupoMensagemCreateRequest(BaseModel):
    mensagem: str = Field(..., min_length=1)

class CommentCreate(BaseModel):
    texto: str

# ==========================================
# ENDPOINTS DE AUTENTICAÇÃO E PERFIL
# ==========================================

@app.post("/api/auth/register")
@app.post("/api/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Cadastra um novo usuário no banco de dados com senha criptografada."""
    usuario_existente = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este email já está cadastrado no sistema."
        )

    # Iniciais do nome
    partes = req.nome.strip().split()
    initials = (partes[0][0] + (partes[-1][0] if len(partes) > 1 else "")).upper()
    handle = "@" + req.nome.lower().replace(" ", "")

    novo_usuario = User(
        nome=req.nome.strip(),
        email=req.email.lower().strip(),
        senha_hash=hash_password(req.senha),
        handle=handle,
        initials=initials,
        idade=req.idade or 30,
        renda_mensal=req.renda_mensal or 5000.0,
        perfil_investidor=req.perfil_investidor or "moderado",
        pontos=10,
        nivel=1,
        nivel_nome="Investidor Iniciante",
        sequencia_meses=1,
        proximo_nivel_pontos=20,
        badge="Bronze"
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    token = create_access_token({"sub": novo_usuario.email, "id": novo_usuario.id})
    return {
        "status": "sucesso",
        "message": "Usuário cadastrado com sucesso",
        "token": token,
        "usuario": format_user_response(novo_usuario)
    }


@app.post("/api/auth/login")
@app.post("/api/login")
@app.post("/login")
@app.post("/")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Autentica o usuário no banco de dados e retorna JWT token."""
    email_limpo = req.email.lower().strip()
    user = db.query(User).filter(User.email == email_limpo).first()

    if not user:
        return {
            "status": "novo_cliente",
            "message": "Cliente inexistente. Redirecionar para cadastro."
        }

    if not verify_password(req.senha, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas. Tente novamente ou recupere sua senha."
        )

    token = create_access_token({"sub": user.email, "id": user.id})
    return {
        "status": "sucesso",
        "message": "Login realizado com sucesso",
        "token": token,
        "usuario": format_user_response(user)
    }


@app.get("/api/auth/me")
@app.get("/api/profile")
def get_profile(
    user_id: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retorna os dados do perfil do usuário logado diretamente do banco de dados."""
    user = current_user
    if user_id and user_id.isdigit():
        target = db.query(User).filter(User.id == int(user_id)).first()
        if target:
            user = target

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    return {
        "status": "sucesso",
        "dados": format_user_response(user)
    }


@app.put("/api/profile")
def update_profile(
    req: ProfileUpdateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Atualiza as informações cadastrais do perfil do usuário."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    if req.nome is not None:
        current_user.nome = req.nome.strip()
    if req.idade is not None:
        current_user.idade = req.idade
    if req.renda_mensal is not None:
        current_user.renda_mensal = req.renda_mensal
    if req.perfil_investidor is not None:
        current_user.perfil_investidor = req.perfil_investidor
    if req.patrimonio_estimado is not None:
        current_user.patrimonio_estimado = req.patrimonio_estimado
    if req.notificacoes_email is not None:
        current_user.notificacoes_email = req.notificacoes_email
    if req.alertas_volatilidade is not None:
        current_user.alertas_volatilidade = req.alertas_volatilidade

    db.commit()
    db.refresh(current_user)

    return {
        "status": "sucesso",
        "message": "Perfil atualizado com sucesso",
        "dados": format_user_response(current_user)
    }


# ==========================================
# ENDPOINT DE DASHBOARD & HOME DO MERCADO
# ==========================================

_TICKER_CACHE = None
_TICKER_CACHE_TIME = 0

@app.get("/api/market/ticker")
def get_market_ticker():
    """
    Retorna as cotações em tempo real do carrossel 'B3 & Global Markets'.
    Possui cache em memória de 3 minutos para não sobrecarregar requisições externas.
    """
    global _TICKER_CACHE, _TICKER_CACHE_TIME
    import time
    agora = time.time()

    # Cache de 3 minutos
    if _TICKER_CACHE and (agora - _TICKER_CACHE_TIME < 180):
        return _TICKER_CACHE

    ticker_map = [
        {"symbol": "IBOVESPA", "yf": "^BVSP", "prefix": "", "suffix": " pts", "decimals": 0},
        {"symbol": "S&P 500", "yf": "^GSPC", "prefix": "", "suffix": " pts", "decimals": 0},
        {"symbol": "NASDAQ", "yf": "^IXIC", "prefix": "", "suffix": " pts", "decimals": 0},
        {"symbol": "DÓLAR", "yf": "BRL=X", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "EURO", "yf": "EURBRL=X", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "BITCOIN", "yf": "BTC-USD", "prefix": "US$ ", "suffix": "", "decimals": 0},
        {"symbol": "PETR4", "yf": "PETR4.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "VALE3", "yf": "VALE3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "ITUB4", "yf": "ITUB4.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "BBDC4", "yf": "BBDC4.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "BBAS3", "yf": "BBAS3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "WEGE3", "yf": "WEGE3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "PRIO3", "yf": "PRIO3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "RENT3", "yf": "RENT3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "ABEV3", "yf": "ABEV3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "SUZB3", "yf": "SUZB3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "MGLU3", "yf": "MGLU3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "LREN3", "yf": "LREN3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "BPAC11", "yf": "BPAC11.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "GGBR4", "yf": "GGBR4.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "ITSA4", "yf": "ITSA4.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "EMBR3", "yf": "EMBR3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "JBSS3", "yf": "JBSS3.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "HGLG11", "yf": "HGLG11.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "MXRF11", "yf": "MXRF11.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "XPML11", "yf": "XPML11.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "BOVA11", "yf": "BOVA11.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
        {"symbol": "SMAL11", "yf": "SMAL11.SA", "prefix": "R$ ", "suffix": "", "decimals": 2},
    ]

    resultado = []
    try:
        import yfinance as yf
        yf_symbols = [t["yf"] for t in ticker_map]
        df_closes = yf.download(yf_symbols, period="5d", interval="1d", progress=False, timeout=4)["Close"]
        
        for item in ticker_map:
            try:
                s = df_closes[item["yf"]].dropna()
                if len(s) >= 2:
                    val = float(s.iloc[-1])
                    val_ant = float(s.iloc[-2])
                    chg = (val / val_ant - 1) * 100
                    up = chg >= 0
                    
                    if item["decimals"] == 0:
                        val_str = f"{val:,.0f}".replace(",", ".")
                    else:
                        val_str = f"{val:.2f}".replace(".", ",")
                        
                    resultado.append({
                        "symbol": item["symbol"],
                        "value": f"{item['prefix']}{val_str}{item['suffix']}",
                        "change": f"{chg:+.2f}%",
                        "up": up
                    })
            except Exception:
                pass
    except Exception as e:
        print(f"[MarketTicker] Aviso ao buscar cotações online: {e}")

    # Adiciona Selic
    resultado.append({
        "symbol": "TAXA SELIC",
        "value": "10,50% a.a.",
        "change": "Estável",
        "up": True
    })

    # Fallback seguro caso Yahoo Finance esteja offline
    if len(resultado) < 5:
        resultado = [
            {"symbol": "IBOVESPA", "value": "131.450 pts", "change": "+0.68%", "up": True},
            {"symbol": "S&P 500", "value": "5.680 pts", "change": "+0.42%", "up": True},
            {"symbol": "NASDAQ", "value": "17.920 pts", "change": "+0.75%", "up": True},
            {"symbol": "DÓLAR (USD)", "value": "R$ 5,42", "change": "-0.31%", "up": False},
            {"symbol": "EURO (EUR)", "value": "R$ 6,05", "change": "-0.15%", "up": False},
            {"symbol": "BITCOIN", "value": "US$ 64.200", "change": "+2.15%", "up": True},
            {"symbol": "PETR4", "value": "R$ 38,50", "change": "+1.85%", "up": True},
            {"symbol": "VALE3", "value": "R$ 62,10", "change": "-0.40%", "up": False},
            {"symbol": "ITUB4", "value": "R$ 34,20", "change": "+1.10%", "up": True},
            {"symbol": "BBAS3", "value": "R$ 27,80", "change": "+1.45%", "up": True},
            {"symbol": "WEGE3", "value": "R$ 52,10", "change": "-0.80%", "up": False},
            {"symbol": "HGLG11", "value": "R$ 163,40", "change": "+0.28%", "up": True},
            {"symbol": "TAXA SELIC", "value": "10.50% a.a.", "change": "Estável", "up": True},
        ]

    _TICKER_CACHE = resultado
    _TICKER_CACHE_TIME = agora
    return resultado


@app.get("/home")
@app.get("/api/home")
def get_home_dashboard(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Retorna o resumo em tempo real do mercado financeiro, índices, destaques e status do usuário.
    """
    # 1. Notícias de destaque via NewsService
    noticias_destaque = news_service.buscar_noticias_ativo("IBOV", limite=3)
    if not noticias_destaque:
        noticias_destaque = news_service.buscar_noticias_ativo("PETR4", limite=3)

    # 2. Ativos em alta calculados com base no MarketService
    acoes_cobertas = market_service.listar_ativos_disponiveis()
    acoes_resumo = []
    for at in acoes_cobertas[:6]:
        try:
            d = market_service.obter_dados_ativo(at["ticker"])
            acoes_resumo.append({
                "ticker": at["ticker"],
                "nome": at["nome"],
                "setor": at["setor"],
                "preco": d.get("preco_atual", 35.0),
                "alta": round(d.get("ma_21_dist", 0.02) * 100, 2),
                "decisao": d.get("decisao_sugerida", "COMPRA"),
                "score": d.get("score_final", 75.0)
            })
        except Exception:
            pass

    return {
        "status": "sucesso",
        "resumo_mercado": {
            "ibovespa": {"pontos": "129.850", "variacao": "+0.68%"},
            "dolar": {"valor": "R$ 5,62", "variacao": "-0.35%"},
            "selic": {"valor": "10,50% a.a.", "status": "Vigente"},
            "cdi": {"valor": "10,40% a.a.", "status": "Vigente"}
        },
        "noticias_destaque": noticias_destaque,
        "acoes_em_alta": acoes_resumo,
        "usuario_logado": format_user_response(current_user) if current_user else None
    }


# ==========================================
# QUESTIONÁRIO, SMART INVEST E CARTEIRAS
# ==========================================

@app.post("/api/questionario", response_model=SmartInvestResponse)
@app.post("/api/smart-invest/optimize", response_model=SmartInvestResponse)
def enviar_questionario(
    req: QuestionarioRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Recebe as respostas do questionário, classifica o perfil com K-Means,
    calcula a alocação de Markowitz e persiste o histórico no banco de dados.
    """
    if req.profile_override:
        perfil_info = {
            "perfil": req.profile_override.lower(),
            "nome": req.profile_override.capitalize(),
            "volatilidade_max": 0.15,
            "descricao": "Perfil definido conforme preferência do usuário."
        }
    else:
        perfil_info = classificar_perfil_investidor(
            idade=req.idade,
            renda=req.renda_mensal,
            tolerancia_risco=req.respostas_risco
        )

    alocacao = otimizar_carteira_smartinvest(perfil_info["perfil"])

    # Salva questionário no banco de dados
    if current_user:
        q_entry = Questionario(
            user_id=current_user.id,
            idade=req.idade,
            renda_mensal=req.renda_mensal,
            respostas_risco=req.respostas_risco,
            perfil_resultado=perfil_info["perfil"],
            volatilidade_maxima=perfil_info["volatilidade_max"],
            alocacao_json=json.dumps(alocacao)
        )
        current_user.perfil_investidor = perfil_info["perfil"]
        current_user.idade = req.idade
        current_user.renda_mensal = req.renda_mensal
        db.add(q_entry)
        db.commit()

    return SmartInvestResponse(
        perfil=perfil_info["perfil"],
        nome_perfil=perfil_info["nome"],
        descricao=perfil_info["descricao"],
        volatilidade_maxima=perfil_info["volatilidade_max"],
        alocacao=alocacao
    )



@app.get("/api/user/carteira")
def get_user_carteira(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retorna os ativos salvos da carteira do usuário."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    itens = db.query(CarteiraItem).filter(CarteiraItem.user_id == current_user.id).all()
    return [
        {
            "id": i.id,
            "ticker": i.ticker,
            "nome": i.nome,
            "classe": i.classe,
            "percentual": i.percentual,
            "preco_medio": i.preco_medio,
            "quantidade": i.quantidade,
            "valor_alocado": i.valor_alocado
        }
        for i in itens
    ]


@app.post("/api/user/carteira")
def salvar_item_carteira(
    req: CarteiraItemRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Adiciona ou atualiza um item na carteira do usuário."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    item = CarteiraItem(
        user_id=current_user.id,
        ticker=req.ticker.upper(),
        nome=req.nome or req.ticker.upper(),
        classe=req.classe,
        percentual=req.percentual,
        preco_medio=req.preco_medio or 0.0,
        quantidade=req.quantidade or 0.0,
        valor_alocado=req.valor_alocado or 0.0
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"status": "sucesso", "item_id": item.id}


@app.delete("/api/user/carteira/{item_id}")
def remover_item_carteira(
    item_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Remove um item da carteira do usuário."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    item = db.query(CarteiraItem).filter(
        CarteiraItem.id == item_id,
        CarteiraItem.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")

    db.delete(item)
    db.commit()
    return {"status": "sucesso", "message": "Item removido da carteira"}


# ==========================================
# COMUNIDADE, POSTS, LIKES E GRUPOS
# ==========================================

@app.get("/api/posts")
def listar_posts(db: Session = Depends(get_db)):
    """Retorna os posts da comunidade em ordem cronológica reversa."""
    posts = db.query(Post).order_by(Post.data_criacao.desc()).all()
    resultado = []
    for p in posts:
        # Formatar tempo relativo
        diff = datetime.utcnow() - p.data_criacao
        if diff.total_seconds() < 3600:
            time_str = f"{max(int(diff.total_seconds() // 60), 1)} min"
        elif diff.total_seconds() < 86400:
            time_str = f"{int(diff.total_seconds() // 3600)} h"
        else:
            time_str = f"{int(diff.total_seconds() // 86400)} d"

        resultado.append({
            "id": str(p.id),
            "author": p.autor_nome,
            "initials": p.autor_initials,
            "handle": p.autor_handle,
            "time": time_str,
            "badge": p.autor_badge,
            "content": p.conteudo,
            "proof": p.comprovante,
            "proof_url": p.comprovante_url,
            "likes": p.likes,
            "comments": p.comentarios_count,
            "tag": p.tag
        })
    return resultado


@app.post("/api/posts")
def criar_post(
    req: PostCreateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Cria uma nova publicação no feed da comunidade e bonifica o usuário se houver comprovante."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    novo_post = Post(
        user_id=current_user.id,
        autor_nome=current_user.nome,
        autor_handle=current_user.handle,
        autor_initials=current_user.initials,
        autor_badge=f"Nível {current_user.nivel} · {current_user.badge}",
        conteudo=req.conteudo,
        tag=req.tag or "Aporte",
        comprovante=req.comprovante or False,
        comprovante_url=req.comprovante_url,
        likes=0,
        comentarios_count=0
    )
    db.add(novo_post)

    # Bonificação por aporte com comprovante
    if req.comprovante:
        current_user.pontos += 1
        if current_user.pontos >= current_user.proximo_nivel_pontos:
            current_user.nivel += 1
            current_user.proximo_nivel_pontos += 10

    db.commit()
    db.refresh(novo_post)

    return {
        "status": "sucesso",
        "message": "Post publicado com sucesso",
        "post_id": novo_post.id,
        "pontos_totais": current_user.pontos
    }


@app.post("/api/posts/{post_id}/like")
def toggle_like_post(
    post_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Dá like ou desfaz like em uma postagem."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")

    user_id = current_user.id if current_user else 1
    like_existente = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == user_id
    ).first()

    if like_existente:
        db.delete(like_existente)
        post.likes = max(post.likes - 1, 0)
        liked = False
    else:
        novo_like = PostLike(post_id=post_id, user_id=user_id)
        db.add(novo_like)
        post.likes += 1
        liked = True

    db.commit()
    return {"status": "sucesso", "likes": post.likes, "liked": liked}


@app.get("/api/posts/{post_id}/comments")
def listar_comentarios(post_id: int, db: Session = Depends(get_db)):
    """Retorna todos os comentários de uma postagem específica."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")

    comentarios = db.query(Comentario).filter(Comentario.post_id == post_id).all()
    
    return [
        {
            "id": c.id,
            "autor_nome": c.autor_nome,
            "autor_initials": c.autor_initials,
            "conteudo": c.conteudo
        }
        for c in comentarios
    ]


@app.post("/api/posts/{post_id}/comments")
def adicionar_comentario(
    post_id: int,
    req: ComentarioCreateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Adiciona um comentário ao post."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")

    coment = Comentario(
        post_id=post_id,
        user_id=current_user.id if current_user else None,
        autor_nome=current_user.nome if current_user else "Investidor Anônimo",
        autor_initials=current_user.initials if current_user else "IA",
        conteudo=req.conteudo
    )
    post.comentarios_count += 1
    db.add(coment)
    db.commit()

    return {"status": "sucesso", "comments_count": post.comentarios_count}

@app.get("/api/groups")
def listar_grupos(db: Session = Depends(get_db)):
    """Retorna a lista de ligas e grupos de investimento."""
    grupos = db.query(Grupo).all()
    return [
        {
            "id": f"g{g.id}",
            "name": g.nome,
            "description": g.descricao,
            "members": g.membros_count,
            "aportes": g.aportes_mes,
            "you": g.posicao_usuario,
            "inviteCode": g.codigo_convite,
            "meta": g.meta_mensal
        }
        for g in grupos
    ]


@app.post("/api/groups")
def criar_grupo(
    req: GrupoCreateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Cria um novo grupo/liga privada."""
    codigo = f"liga-{req.nome.lower().replace(' ', '-')[:12]}-{os.urandom(2).hex()}"
    novo_grupo = Grupo(
        nome=req.nome,
        descricao=req.descricao,
        meta_mensal=req.meta_mensal or 500.0,
        privado=req.privado if req.privado is not None else True,
        codigo_convite=codigo,
        membros_count=1,
        aportes_mes=1,
        posicao_usuario=1,
        criado_por=current_user.id if current_user else None
    )
    db.add(novo_grupo)
    db.commit()
    db.refresh(novo_grupo)

    return {
        "status": "sucesso",
        "grupo": {
            "id": f"g{novo_grupo.id}",
            "name": novo_grupo.nome,
            "inviteCode": novo_grupo.codigo_convite
        }
    }


@app.post("/api/groups/join")
def entrar_grupo(
    req: GrupoJoinRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Permite a um investidor ingressar em uma liga por código de convite ou link."""
    codigo_limpo = req.codigo.strip()
    if "/" in codigo_limpo:
        codigo_limpo = codigo_limpo.split("/")[-1].strip()
    
    grupo = None
    if codigo_limpo.startswith("g") and codigo_limpo[1:].isdigit():
        grupo = db.query(Grupo).filter(Grupo.id == int(codigo_limpo[1:])).first()
    
    if not grupo:
        grupo = db.query(Grupo).filter(Grupo.codigo_convite.ilike(codigo_limpo)).first()
        
    if not grupo:
        grupo = db.query(Grupo).filter(Grupo.nome.ilike(f"%{codigo_limpo}%")).first()

    if not grupo:
        raise HTTPException(status_code=404, detail="Liga não encontrada com esse código de convite.")

    grupo.membros_count = (grupo.membros_count or 0) + 1
    if current_user:
        current_user.pontos = (current_user.pontos or 0) + 2

    db.commit()
    db.refresh(grupo)

    return {
        "status": "sucesso",
        "message": f"Você entrou na liga '{grupo.nome}' com sucesso!",
        "grupo": {
            "id": f"g{grupo.id}",
            "name": grupo.nome,
            "members": grupo.membros_count,
            "inviteCode": grupo.codigo_convite,
            "meta": grupo.meta_mensal,
            "aportes": grupo.aportes_mes
        }
    }


@app.post("/api/groups/{grupo_id}/aporte")
def registrar_aporte_grupo(
    grupo_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Registra o aporte mensal do investidor na liga, atualizando o progresso coletivo."""
    gid = int(grupo_id.replace("g", "")) if (isinstance(grupo_id, str) and grupo_id.startswith("g")) else int(grupo_id)
    grupo = db.query(Grupo).filter(Grupo.id == gid).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Liga não encontrada.")

    grupo.aportes_mes = (grupo.aportes_mes or 0) + 1
    if grupo.aportes_mes > grupo.membros_count:
        grupo.membros_count = grupo.aportes_mes

    if current_user:
        current_user.pontos = (current_user.pontos or 0) + 5
        current_user.sequencia_meses = (current_user.sequencia_meses or 0) + 1

    db.commit()
    db.refresh(grupo)

    return {
        "status": "sucesso",
        "message": f"Aporte registrado com sucesso na liga '{grupo.nome}'! +5 pontos concedidos.",
        "aportes": grupo.aportes_mes,
        "members": grupo.membros_count
    }


@app.get("/api/groups/{grupo_id}")
def obter_grupo(grupo_id: str, db: Session = Depends(get_db)):
    gid = int(grupo_id.replace("g", "")) if (isinstance(grupo_id, str) and grupo_id.startswith("g")) else int(grupo_id)
    g = db.query(Grupo).filter(Grupo.id == gid).first()
    if not g:
        raise HTTPException(status_code=404, detail="Liga não encontrada.")
    return {
        "id": f"g{g.id}",
        "name": g.nome,
        "description": g.descricao,
        "members": g.membros_count,
        "aportes": g.aportes_mes,
        "you": g.posicao_usuario,
        "inviteCode": g.codigo_convite,
        "meta": g.meta_mensal
    }


@app.get("/api/groups/{grupo_id}/messages")
def listar_mensagens_grupo(
    grupo_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retorna o histórico de mensagens do chat estilo WhatsApp da liga."""
    gid = int(grupo_id.replace("g", "")) if (isinstance(grupo_id, str) and grupo_id.startswith("g")) else int(grupo_id)
    grupo = db.query(Grupo).filter(Grupo.id == gid).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Liga não encontrada.")

    mensagens = db.query(GrupoMensagem).filter(GrupoMensagem.grupo_id == gid).order_by(GrupoMensagem.id.asc()).all()

    # Se não houver mensagens ainda, semeia mensagens iniciais realistas dos membros da liga
    if not mensagens:
        seed_msgs = [
            ("Marina Costa", "MC", f"Fala pessoal! Sejam bem-vindos ao grupo da {grupo.nome}! 🚀"),
            ("Caio Menezes", "CM", "Show demais! Vamos manter o foco na disciplina dos aportes esse mês."),
            ("Rafael Duarte", "RD", "Meu aporte de R$ 500 em FIIs de tijolo já tá lançado! 📈"),
        ]
        for autor, init, txt in seed_msgs:
            m = GrupoMensagem(
                grupo_id=gid,
                autor_nome=autor,
                autor_initials=init,
                mensagem=txt,
                data_criacao=datetime.utcnow()
            )
            db.add(m)
        db.commit()
        mensagens = db.query(GrupoMensagem).filter(GrupoMensagem.grupo_id == gid).order_by(GrupoMensagem.id.asc()).all()

    current_uid = current_user.id if current_user else 1
    current_nome = current_user.nome if current_user else "Rafael Duarte"

    return [
        {
            "id": m.id,
            "from": m.autor_nome,
            "initials": m.autor_initials,
            "mine": (m.user_id == current_uid) or (m.autor_nome == current_nome),
            "text": m.mensagem,
            "time": m.data_criacao.strftime("%H:%M") if m.data_criacao else "Recente"
        }
        for m in mensagens
    ]


@app.post("/api/groups/{grupo_id}/messages")
def enviar_mensagem_grupo(
    grupo_id: str,
    req: GrupoMensagemCreateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Envia uma nova mensagem no chat estilo WhatsApp da liga."""
    gid = int(grupo_id.replace("g", "")) if (isinstance(grupo_id, str) and grupo_id.startswith("g")) else int(grupo_id)
    grupo = db.query(Grupo).filter(Grupo.id == gid).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Liga não encontrada.")

    autor_nome = current_user.nome if current_user else "Rafael Duarte"
    autor_initials = current_user.initials if current_user else "RD"
    user_id = current_user.id if current_user else 1

    nova_msg = GrupoMensagem(
        grupo_id=gid,
        user_id=user_id,
        autor_nome=autor_nome,
        autor_initials=autor_initials,
        mensagem=req.mensagem.strip()
    )
    db.add(nova_msg)
    db.commit()
    db.refresh(nova_msg)

    return {
        "status": "sucesso",
        "mensagem": {
            "id": nova_msg.id,
            "from": nova_msg.autor_nome,
            "initials": nova_msg.autor_initials,
            "mine": True,
            "text": nova_msg.mensagem,
            "time": nova_msg.data_criacao.strftime("%H:%M") if nova_msg.data_criacao else "Agora"
        }
    }


@app.get("/api/ranking/users")
def get_user_gamification_ranking(db: Session = Depends(get_db)):
    """Retorna o ranking de usuários por pontos e disciplina de aportes."""
    users = db.query(User).order_by(User.pontos.desc()).all()
    return [
        {
            "pos": idx + 1,
            "name": u.nome,
            "initials": u.initials,
            "points": u.pontos,
            "streak": u.sequencia_meses,
            "badge": u.badge,
            "level": u.nivel
        }
        for idx, u in enumerate(users)
    ]


# ==========================================
# RANKING QUANTITATIVO, ATIVOS E ANÁLISE IA
# ==========================================

@app.get("/api/ranking")
@app.get("/ranking")
def obter_ranking(top_n: int = Query(default=10, ge=1, le=50)):
    """Retorna o ranking quantitativo multi-fatorial de ações da B3."""
    try:
        return gerar_ranking_inteligente(top_n=top_n)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar ranking: {str(exc)}")


@app.get("/api/stocks")
def listar_acoes(
    search: Optional[str] = Query(default=None),
    classe: Optional[str] = Query(default=None),
    limit: int = Query(default=250, ge=1, le=1000)
):
    """Lista os ativos acompanhados com dados atualizados e setoriais da base real da B3."""
    return market_service.listar_ativos_disponiveis(limit=limit, search=search, classe=classe)


@app.get("/api/analyze/{ticker}")
def analisar_ativo_orquestrado(ticker: str):
    """
    Pipeline de Orquestração Quantitativo + NLP + OpenRouter:
    1. Coleta dados quantitativos + indicadores técnicos + inferência XGBoost
    2. Coleta notícias recentes e analisa sentimento FinBERT
    3. OpenRouter (Modelos Gratuitos) sintetiza o parecer institucional executivo.
    """
    ticker_upper = ticker.upper().strip()

    # 1. Camada Quantitativa
    dados_quant = market_service.obter_dados_ativo(ticker_upper)

    # 2. Camada de NLP
    noticias = news_service.buscar_noticias_ativo(ticker_upper, limite=5)
    sentimento_score = news_service.calcular_indice_humor(noticias)

    # 3. Orquestração OpenRouter
    orquestracao = openrouter_service.orquestrar_analise_ativo(
        ticker=ticker_upper,
        dados_quantitativos=dados_quant,
        noticias=noticias,
        sentimento_nlp=sentimento_score
    )

    return {
        "ticker": ticker_upper,
        "dados_quantitativos": dados_quant,
        "sentimento_noticias": {
            "score_humor_liquido": round(sentimento_score, 3),
            "total_noticias": len(noticias),
            "noticias": noticias
        },
        "orquestracao_ia": {
            "parecer_executivo": orquestracao["sintese_ia"],
            "modelo_utilizado": orquestracao.get("modelo_utilizado"),
            "status_ia": orquestracao.get("status_ia", False),
            "aviso": orquestracao.get("aviso", "")
        }
    }


@app.get("/api/news")
def obter_noticias_mercado(ticker: Optional[str] = None, limit: int = Query(default=10, ge=1, le=30)):
    """Retorna as notícias recentes de mercado com sentimento classificado por FinBERT."""
    if ticker:
        return news_service.buscar_noticias_ativo(ticker, limite=limit)

    noticias_gerais = []
    for t in ["PETR4", "VALE3", "ITUB4"]:
        noticias_gerais.extend(news_service.buscar_noticias_ativo(t, limite=3))
    return noticias_gerais[:limit]


@app.post("/api/chat", response_model=ChatResponse)
def chat_financeiro(
    req: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Endpoint de Chat com o Assistente OpenRouter (Modelos Gratuitos) e persistência de histórico."""
    contexto = None
    if req.ticker:
        try:
            contexto = market_service.obter_dados_ativo(req.ticker)
        except Exception:
            pass

    historico_dict = [{"role": m.role, "content": m.content} for m in req.history] if req.history else []

    res = openrouter_service.responder_chat_financeiro(
        mensagem_usuario=req.message,
        historico_mensagens=historico_dict,
        contexto_mercado=contexto
    )

    # Persistir mensagem no histórico
    try:
        user_id = current_user.id if current_user else 1
        db.add(ChatLog(
            user_id=user_id,
            role="user",
            mensagem=req.message,
            modelo_utilizado=res.get("modelo_utilizado")
        ))
        db.add(ChatLog(
            user_id=user_id,
            role="assistant",
            mensagem=res["resposta"],
            modelo_utilizado=res.get("modelo_utilizado")
        ))
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[Chat] Aviso ao registrar histórico: {e}")

    return ChatResponse(
        response=res["resposta"],
        model_used=res.get("modelo_utilizado"),
        success=res.get("sucesso", False),
        notice=res.get("aviso")
    )


@app.get("/api/chat/history")
def get_chat_history(
    limit: int = Query(default=30, ge=1, le=100),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retorna as mensagens recentes do chat gravadas no banco de dados."""
    user_id = current_user.id if current_user else 1
    logs = db.query(ChatLog).filter(
        (ChatLog.user_id == user_id) | (ChatLog.user_id.is_(None))
    ).order_by(ChatLog.data_criacao.desc()).limit(limit).all()
    logs.reverse()

    return [
        {
            "id": l.id,
            "role": l.role,
            "content": l.mensagem,
            "model_used": l.modelo_utilizado,
            "created_at": l.data_criacao.strftime("%H:%M") if l.data_criacao else "Recente"
        }
        for l in logs
    ]


@app.get("/api/status")
def status_health():
    """Verifica a saúde do backend, banco de dados, modelos de ML e OpenRouter."""
    tem_openrouter = bool(OPENROUTER_API_KEY)
    tem_xgboost = (MODELS_DIR / "xgboost.pkl").exists()
    tem_dados = (DATA_DIR / "raw" / "dataset_final.parquet").exists()
    tem_db = (DATA_DIR / "smartinvest.db").exists()

    return {
        "status": "ONLINE",
        "versao": "2.0.0",
        "database": {
            "tipo": "SQLite / SQLAlchemy ORM",
            "arquivo_db": "data/smartinvest.db",
            "conectado": tem_db
        },
        "openrouter": {
            "configurado": tem_openrouter,
            "modelos_gratuitos_ativos": OPENROUTER_FREE_MODELS,
            "tier": "100% GRATUITO (:free)"
        },
        "ml_quantitativo": {
            "modelo_xgboost_disponivel": tem_xgboost,
            "base_dados_disponivel": tem_dados
        }
    }

@app.delete("/api/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    # Busca o post no banco de dados
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado")
        
    # Deleta o post
    db.delete(post)
    db.commit()
    
    return {"status": "success", "message": "Post excluído com sucesso"}