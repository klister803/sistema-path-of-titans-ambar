from fastapi import HTTPException
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())

    async def check(self, api_key: str) -> bool:
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=self.window_seconds)
        
        # Remove old requests
        self.requests[api_key] = [
            req_time for req_time in self.requests[api_key]
            if req_time > window_start
        ]
        
        # Check rate limit
        if len(self.requests[api_key]) >= self.max_requests:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded"
            )
        
        self.requests[api_key].append(now)
        return True

    async def _cleanup_loop(self):
        while True:
            await asyncio.sleep(self.window_seconds)
            now = datetime.utcnow()
            window_start = now - timedelta(seconds=self.window_seconds)
            
            for api_key in list(self.requests.keys()):
                self.requests[api_key] = [
                    req_time for req_time in self.requests[api_key]
                    if req_time > window_start
                ]
                if not self.requests[api_key]:
                    del self.requests[api_key]
