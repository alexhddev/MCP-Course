import sys
from mcp.server.fastmcp import FastMCP
from mcp.types import TextContent, ImageContent, CallToolResult
import requests
import base64

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

@mcp.tool(
    name="Get pizza menu with images",
    description="Get the menu from awesome pizza with images."
)
def get_pizza_menu_with_images() -> CallToolResult:
    from api_client import get_daily_menu
    menu = get_daily_menu()
    content = []
    for item in menu:
        content.append(
            TextContent(type="text", text=item["name"])
        )
        content.append(
            TextContent(type="text", text=item["description"])
        )
        image_url = f'http://localhost:3000/{item["imageUrl"]}' 
        image_response = requests.get(image_url)    

        # Convert image to base64
        img_data = base64.b64encode(image_response.content).decode('utf-8') 

        content.append(
            ImageContent(
                type="image",
                data=img_data,
                mimeType="image/png"                
            )
        )

    return CallToolResult(
        content=content
    )