from mcp.server.fastmcp import FastMCP

from contextlib import asynccontextmanager
from fastapi import FastAPI
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize MCP server on startup."""
    async with mcp.session_manager.run():
        yield
        
app = FastAPI(lifespan=lifespan)

mcp = FastMCP("hello-mcp")

# Hello name tool
@mcp.tool(name="hello_name", description="Says hello to the provided name")
def say_hello(name: str) -> str:
    return f"Heelo {name}! You are awesome"

app.mount("/", mcp.streamable_http_app())


def main():
    """Main entry point for the MCP server."""
    uvicorn.run(app, host="localhost", port=8000, log_level="debug")


if __name__ == "__main__":
    main()




