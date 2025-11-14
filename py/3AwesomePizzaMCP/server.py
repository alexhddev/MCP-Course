from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Awesome pizza MCP")

@mcp.tool(
    name="Test tool",
    description="Test tool description"
)
def say_hello() -> str:
    return 'Hello from MCP!'

@mcp.tool(
    name="Get pizza menu",
    description="Get the menu from awesome pizza."
)
def get_pizza_menu():
    from api_client import get_daily_menu
    menu = get_daily_menu()
    return menu