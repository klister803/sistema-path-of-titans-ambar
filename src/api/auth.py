from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from .config import API_KEYS

api_key_header = APIKeyHeader(name="X-API-Key")

async def verify_api_key(api_key: str = Security(api_key_header)) -> str:
    if api_key not in API_KEYS:
        raise HTTPException(
            status_code=403,
            detail="Invalid API key"
        )
    return api_key
