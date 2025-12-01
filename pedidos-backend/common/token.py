import os
import time
import jwt


def _get_secret() -> str:
    secret = os.environ.get('JWT_SECRET')
    if not secret:
        # Fallback for academic/dev environments
        secret = 'dev-secret-change-me'
    return secret


def _get_issuer() -> str:
    return os.environ.get('JWT_ISSUER', 'pedidos-backend')


def create_token(user_id: str, claims: dict | None = None, expires_in_sec: int = 3600) -> str:
    now = int(time.time())
    payload = {
        'sub': user_id,
        'iat': now,
        'exp': now + expires_in_sec,
        'iss': _get_issuer(),
    }
    if claims:
        payload.update(claims)
    token = jwt.encode(payload, _get_secret(), algorithm='HS256')
    # PyJWT returns str in v2.x
    return token


def verify_token(token: str) -> dict:
    payload = jwt.decode(token, _get_secret(), algorithms=['HS256'], options={'require': ['exp', 'iat', 'sub']}, issuer=_get_issuer())
    return payload
