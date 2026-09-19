import hashlib
import hmac
import os
import json
import base64
import time
from typing import Optional, Dict, Any

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "smartinvest-super-secret-production-key-2026-b3")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 60 * 60 * 24 * 7  # 7 dias


def hash_password(password: str) -> str:
    """Gera hash seguro da senha usando PBKDF2-HMAC-SHA256 com salt dinâmico."""
    salt = os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return salt.hex() + ":" + pwd_hash.hex()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto plano confere com o hash salvo."""
    try:
        if ":" not in hashed_password:
            # Fallback para hashes simples legado se houver
            return hashlib.sha256(plain_password.encode("utf-8")).hexdigest() == hashed_password

        salt_hex, pwd_hash_hex = hashed_password.split(":", 1)
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(pwd_hash_hex)
        computed_hash = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 100000)
        return hmac.compare_digest(expected_hash, computed_hash)
    except Exception:
        return False


def _base64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')


def _base64_decode(data_str: str) -> bytes:
    padding = '=' * (4 - (len(data_str) % 4)) if (len(data_str) % 4) != 0 else ''
    return base64.urlsafe_b64decode((data_str + padding).encode('utf-8'))


def create_access_token(data: Dict[str, Any], expires_delta: Optional[int] = None) -> str:
    """Cria um token JWT assinado digitalmente com HMAC-SHA256."""
    to_encode = data.copy()
    expire_time = int(time.time()) + (expires_delta if expires_delta else ACCESS_TOKEN_EXPIRE_SECONDS)
    to_encode.update({"exp": expire_time})

    header = {"alg": "HS256", "typ": "JWT"}
    header_bytes = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_bytes = json.dumps(to_encode, separators=(',', ':')).encode('utf-8')

    header_b64 = _base64_encode(header_bytes)
    payload_b64 = _base64_encode(payload_bytes)

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    signature_b64 = _base64_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodifica e valida o token JWT."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None

        header_b64, payload_b64, signature_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = _base64_decode(signature_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_json = _base64_decode(payload_b64).decode('utf-8')
        payload = json.loads(payload_json)

        # Checar expiração
        if "exp" in payload and payload["exp"] < int(time.time()):
            return None

        return payload
    except Exception:
        return None
