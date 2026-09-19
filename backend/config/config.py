import os
from pathlib import Path
import yaml
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Lista de Modelos GRATUITOS (:free tier) ativos e testados no OpenRouter
OPENROUTER_FREE_MODELS = [
    "openrouter/free",
    "inclusionai/ling-3.0-flash-fin:free",
    "inclusionai/ling-3.0-flash-vl:free",
    "liquid/lfm-2.5-2.6b:free",
    "deepseek/deepseek-v4-flash-0731:free",
    "nvidia/nemotron-3.5-lightning:free"
]


def get_openrouter_api_key() -> str:
    """
    Busca dinamicamente a chave do OpenRouter em tempo de execução:
    1. Variável de ambiente OPENROUTER_API_KEY
    2. Arquivo .env
    3. Arquivo secure_keys.yml / config.yaml
    """
    # 1. Recarregar .env
    load_dotenv(BASE_DIR / ".env", override=True)
    env_key = os.getenv("OPENROUTER_API_KEY")
    if env_key and env_key.strip():
        return env_key.strip()

    # 2. Ler secure_keys.yml
    for filename in ["secure_keys.yml", "config.yaml", "config.yml"]:
        file_path = BASE_DIR / filename
        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f)
                    if isinstance(data, dict):
                        apis = data.get("apis", {})
                        if isinstance(apis, dict):
                            k = apis.get("openrouter_api_key") or apis.get("OPENROUTER_API_KEY")
                            if k and str(k).strip():
                                return str(k).strip()
                        k_direct = data.get("openrouter_api_key") or data.get("OPENROUTER_API_KEY")
                        if k_direct and str(k_direct).strip():
                            return str(k_direct).strip()
            except Exception as e:
                print(f"[Config] Aviso ao ler {filename}: {e}")

    return ""


def get_news_api_key() -> str:
    """Busca dinamicamente a chave da NewsAPI."""
    load_dotenv(BASE_DIR / ".env", override=True)
    env_key = os.getenv("NEWS_API_KEY")
    if env_key and env_key.strip():
        return env_key.strip()

    for filename in ["secure_keys.yml", "config.yaml", "config.yml"]:
        file_path = BASE_DIR / filename
        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f)
                    if isinstance(data, dict):
                        apis = data.get("apis", {})
                        if isinstance(apis, dict):
                            k = apis.get("news_api_key")
                            if k: return str(k).strip()
            except Exception:
                pass
    return os.getenv("NEWS_API_KEY", "")


# Valores estáticos exportados para compatibilidade
OPENROUTER_API_KEY = get_openrouter_api_key()
NEWS_API_KEY = get_news_api_key()

# Diretórios principais (Arquitetura Macro)
BACKEND_DIR = BASE_DIR / "backend"
DATA_DIR = BACKEND_DIR / "data"
ML_DIR = BASE_DIR / "ml"
MODELS_DIR = ML_DIR / "models"
REPORTS_DIR = ML_DIR / "reports"

DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
