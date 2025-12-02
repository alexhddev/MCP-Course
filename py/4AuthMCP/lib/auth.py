from fastapi import Request
from fastapi.responses import Response
from .cool_oauth_client import check_token

# OAuth 2.1 configuration
WWW_HEADER = {
    "WWW-Authenticate": f'Bearer realm="OAuth", resource_metadata="http://localhost:8000/.well-known/oauth-protected-resource/mcp"'
}

async def auth_middleware(request: Request, call_next):
    try:
        public_paths = [".well-known", "/health", "/authorize", "/token"]
        if any(path in request.url.path for path in public_paths):
            return await call_next(request)

        auth_header = request.headers.get("authorization")       
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response(
                content='{"error": "Missing Bearer token"}',
                media_type="application/json",
                status_code=401,
                headers=WWW_HEADER
            )
        token = auth_header.split("Bearer ")[1].strip()

        is_valid = check_token(token)

        if not is_valid:
            return Response(
                content='{"error": "Invalid token"}',
                media_type="application/json",
                status_code=401,
                headers=WWW_HEADER
            )  
                  
        return await call_next(request)
    
    except Exception:
        return Response(
            content='{"error": "Authentication failed"}',
            media_type="application/json",
            status_code=401,
            headers=WWW_HEADER
        )
    