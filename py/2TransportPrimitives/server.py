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

@mcp.tool(
    name="get_error_logs",
    description="Returns error logs"
)
def get_error_logs() -> str:
    error_logs = []    
    try:
        with open("data/logs.txt", 'r') as file:
            for line in file:
                line = line.strip()
                if '[ERROR]' in line:
                    error_logs.append(line)
    except FileNotFoundError:
        return f"Error: File 'data/logs.txt' not found."
    except Exception as e:
        return f"Error reading file: {e}"
    
    return '\n'.join(error_logs) if error_logs else "No error logs found."


@mcp.resource(
    uri="file:///data/logs.txt",
    name="read_logs",
    description="Read the contents of the logs file",
    mime_type="text/plain"
)
def read_logs() -> str:
    try:
        with open("data/logs.txt", "r") as f:
            return f.read()
    except FileNotFoundError:
        return "Error: logs.txt file not found"
    except Exception as e:
        return f"Error reading logs: {str(e)}"
    
@mcp.resource(
    "items://{id}/price",
    description="Get the price of an item by its ID"
)
def get_inventory_price_from_id(id: str) -> str:
   if id == "42":
        return "19.99 USD"   
   if id == "7":
        return "5.49 USD"
   else:
       return "Item not found"