import asyncio
from datetime import datetime
from typing import List, Optional
from collections import deque
from .models import CommandResponse, ServerStatus
from .config import RCON_CONFIG

class RconManager:
    _instance = None
    _command_history: deque = deque(maxlen=100)
    _lock = asyncio.Lock()
    
    @classmethod
    async def get_instance(cls):
        if not cls._instance:
            async with cls._lock:
                if not cls._instance:
                    cls._instance = cls()
                    await cls._instance.connect()
        return cls._instance
    
    async def connect(self):
        try:
            self.rcon = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: WebSocketRcon(
                    host=RCON_CONFIG["host"],
                    port=RCON_CONFIG["port"],
                    password=RCON_CONFIG["password"],
                    timeout=RCON_CONFIG["timeout"]
                )
            )
            await self.rcon.connect()
        except Exception as e:
            raise ConnectionError(f"Failed to connect to RCON: {str(e)}")

    @classmethod
    async def execute_command(cls, command: str) -> str:
        instance = await cls.get_instance()
        response = await instance.rcon.send(command)
        
        command_entry = CommandResponse(
            command=command,
            response=response,
            timestamp=datetime.utcnow(),
            success=True
        )
        cls._command_history.append(command_entry)
        return response

    @classmethod
    async def get_status(cls) -> ServerStatus:
        instance = await cls.get_instance()
        try:
            response = await instance.rcon.send("status")
            return ServerStatus(
                connected=True,
                last_check=datetime.utcnow(),
                status=response
            )
        except Exception as e:
            return ServerStatus(
                connected=False,
                last_check=datetime.utcnow(),
                error=str(e)
            )

    @classmethod
    async def get_command_history(cls, limit: Optional[int] = 10) -> List[CommandResponse]:
        return list(cls._command_history)[-limit:]
