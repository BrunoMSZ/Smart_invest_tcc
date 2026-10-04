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

    # Migração leve SQLite: adiciona coluna bio se ainda não existir
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            cols = [row[1] for row in conn.execute(text("PRAGMA table_info(users)")).fetchall()]
            if "bio" not in cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN bio TEXT"))
                conn.commit()
            if "presenca" not in cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN presenca VARCHAR(20) DEFAULT 'disponivel'"))
                conn.commit()
            if "capa_url" not in cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN capa_url TEXT"))
                conn.commit()
            post_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(posts)")).fetchall()]
            if "shared_from_post_id" not in post_cols:
                conn.execute(text("ALTER TABLE posts ADD COLUMN shared_from_post_id INTEGER"))
                conn.commit()
            comment_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(comentarios)")).fetchall()]
            if "parent_id" not in comment_cols:
                conn.execute(text("ALTER TABLE comentarios ADD COLUMN parent_id INTEGER"))
                conn.commit()
            if "likes" not in comment_cols:
                conn.execute(text("ALTER TABLE comentarios ADD COLUMN likes INTEGER DEFAULT 0"))
                conn.commit()
    except Exception as e:
        print(f"[init_db] Aviso ao migrar colunas: {e}")

    from .seed import seed_database
    seed_database()
