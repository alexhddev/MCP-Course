from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Awesome pizza MCP")

@mcp.tool(
    name="Test tool",
    description="Test tool description"
)
def say_hello() -> str:
    return 'Hello from MCP!'