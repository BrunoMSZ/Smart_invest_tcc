import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
try:
    from backend.config.config import DATA_DIR
except ImportError:
    from config.config import DATA_DIR

DB_FILE = DATA_DIR / "smartinvest.db"
DATABASE_URL = f"sqlite:///{DB_FILE.as_posix()}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency para obter sessão do banco de dados no FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Inicializa as tabelas do banco de dados e insere dados padrão caso vazio."""
    # Garante que a pasta data/ existe
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    # Importa os models para registrá-los no Base
    from . import models
    Base.metadata.create_all(bind=engine)
    from .seed import seed_database
    seed_database()
