from mcp.server.fastmcp import FastMCP

# Create an MCP server instance with a custom name.
mcp = FastMCP("Hello name MCP")

# Hello name tool
@mcp.tool(
    name="hello_name",
    description="Says hello to the provided name"
)
def say_hello(name: str) -> str:
    return f'Heelo {name}! You are awesome'
