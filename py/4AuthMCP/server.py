from mcp.server.fastmcp import FastMCP

from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import uvicorn

from lib.auth import auth_middleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize MCP server on startup."""
    async with mcp.session_manager.run():
        yield
        
app = FastAPI(lifespan=lifespan)

app.middleware("http")(auth_middleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your actual origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

mcp = FastMCP("hello-mcp", stateless_http=True)

# Hello name tool
@mcp.tool(name="hello_name", description="Says hello to the provided name")
def say_hello(name: str) -> str:
    return f"Heelo {name}! You are awesome"

# MCP well-known endpoint
@app.get("/.well-known/oauth-protected-resource/mcp")
async def oauth_protected_resource_metadata():

    return {
        "authorization_servers": ["http://localhost:4000/authorize"],
        "bearer_methods_supported": ["header", "body"],
        "resource": "http://localhost:8000/mcp",  # url of the mcp server
        "scopes_supported": ["mcp:tools:search:read"],
    }

# MCP well-known endpoint
@app.get("/.well-known/oauth-protected-resource")
async def oauth_protected_resource_metadata():

    return {
        "authorization_servers": ["http://localhost:4000/authorize"],
        "bearer_methods_supported": ["header", "body"],
        "resource": "http://localhost:8000/mcp",  # url of the mcp server
        "scopes_supported": ["mcp:tools:search:read"],
    }

# OAuth authorization server metadata endpoint
@app.get("/.well-known/oauth-authorization-server")
async def oauth_authorization_server_metadata():
    return {
        "issuer": "http://localhost:4000",
        "authorization_endpoint": "http://localhost:4000/authorize",
        "token_endpoint": "http://localhost:4000/token",
        "response_types_supported": ["code"],
        "grant_types_supported": ["authorization_code"],
        "code_challenge_methods_supported": ["S256"],
        "scopes_supported": ["mcp:tools:search:read"],
    }

app.mount("/", mcp.streamable_http_app())


def main():
    """Main entry point for the MCP server."""
    uvicorn.run(app, host="localhost", port=8000, log_level="debug")


if __name__ == "__main__":
    main()




