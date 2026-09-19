from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    handle = Column(String(60), default="@investidor")
    initials = Column(String(10), default="US")
    perfil_investidor = Column(String(50), default="moderado")  # conservador, moderado, arrojado
    renda_mensal = Column(Float, default=5000.0)
    idade = Column(Integer, default=30)
    patrimonio_estimado = Column(Float, default=50000.0)
    avatar_url = Column(String(255), nullable=True)
    pontos = Column(Integer, default=34)
    nivel = Column(Integer, default=6)
    nivel_nome = Column(String(80), default="Investidor Consistente")
    sequencia_meses = Column(Integer, default=8)
    proximo_nivel_pontos = Column(Integer, default=40)
    badge = Column(String(50), default="Ouro")
    notificacoes_email = Column(Boolean, default=True)
    alertas_volatilidade = Column(Boolean, default=True)
    data_cadastro = Column(DateTime, default=datetime.utcnow)

    # Relacionamentos
    questionarios = relationship("Questionario", back_populates="usuario", cascade="all, delete-orphan")
    carteira_itens = relationship("CarteiraItem", back_populates="usuario", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="usuario", cascade="all, delete-orphan")
    comentarios = relationship("Comentario", back_populates="usuario", cascade="all, delete-orphan")


class Questionario(Base):
    __tablename__ = "questionarios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    idade = Column(Integer, nullable=False)
    renda_mensal = Column(Float, nullable=False)
    respostas_risco = Column(Integer, nullable=False)
    perfil_resultado = Column(String(50), nullable=False)
    volatilidade_maxima = Column(Float, default=0.15)
    alocacao_json = Column(Text, nullable=True)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="questionarios")


class CarteiraItem(Base):
    __tablename__ = "carteira_itens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ticker = Column(String(20), nullable=False)
    nome = Column(String(120), nullable=True)
    classe = Column(String(50), default="Ação")  # Renda Fixa, FII, Ação, ETF
    percentual = Column(Float, default=0.0)
    preco_medio = Column(Float, default=0.0)
    quantidade = Column(Float, default=0.0)
    valor_alocado = Column(Float, default=0.0)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="carteira_itens")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    autor_nome = Column(String(120), nullable=False)
    autor_handle = Column(String(60), default="@usuario")
    autor_initials = Column(String(10), default="US")
    autor_badge = Column(String(80), default="Investidor")
    conteudo = Column(Text, nullable=False)
    tag = Column(String(40), default="Aporte")  # Aporte, Análise, Liga, Dúvida
    comprovante = Column(Boolean, default=False)
    comprovante_url = Column(String(Text), nullable=True)
    likes = Column(Integer, default=0)
    comentarios_count = Column(Integer, default=0)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="posts")
    comentarios = relationship("Comentario", back_populates="post", cascade="all, delete-orphan")
    likes_rel = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")


class PostLike(Base):
    __tablename__ = "post_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    post = relationship("Post", back_populates="likes_rel")


class Comentario(Base):
    __tablename__ = "comentarios"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    autor_nome = Column(String(120), nullable=False)
    autor_initials = Column(String(10), default="US")
    conteudo = Column(Text, nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    post = relationship("Post", back_populates="comentarios")
    usuario = relationship("User", back_populates="comentarios")


class Grupo(Base):
    __tablename__ = "grupos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    descricao = Column(Text, nullable=True)
    meta_mensal = Column(Float, default=500.0)
    privado = Column(Boolean, default=True)
    codigo_convite = Column(String(50), unique=True, nullable=True)
    membros_count = Column(Integer, default=1)
    aportes_mes = Column(Integer, default=0)
    posicao_usuario = Column(Integer, default=1)
    criado_por = Column(Integer, ForeignKey("users.id"), nullable=True)
    data_criacao = Column(DateTime, default=datetime.utcnow)


class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    role = Column(String(20), nullable=False)  # user, assistant
    mensagem = Column(Text, nullable=False)
    modelo_utilizado = Column(String(100), nullable=True)
    data_criacao = Column(DateTime, default=datetime.utcnow)


class GrupoMensagem(Base):
    __tablename__ = "grupo_mensagens"

    id = Column(Integer, primary_key=True, index=True)
    grupo_id = Column(Integer, ForeignKey("grupos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    autor_nome = Column(String(100), default="Investidor")
    autor_initials = Column(String(10), default="IN")
    mensagem = Column(Text, nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)

