from mcp.server.fastmcp import FastMCP
from quotes import get_sad_quote, get_happy_quote

mcp = FastMCP("AXBV-quotes-server")

@mcp.tool(
    name="Get-AXBV-happy-quote"
)
def get_axbv_happy_quote() -> str:
    return get_happy_quote()

@mcp.tool(
    name="Get-AXBV-sad-quote"
)
def get_axbv_sad_quote() -> str:
    return get_sad_quote()

if __name__== "__main__":
    mcp.run()