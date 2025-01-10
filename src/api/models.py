from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommandRequest(BaseModel):
    command: str

class CommandResponse(BaseModel):
    command: str
    response: str
    timestamp: datetime
    success: bool
    error: Optional[str] = None

class ServerStatus(BaseModel):
    connected: bool
    last_check: datetime
    status: Optional[str] = None
    error: Optional[str] = None
