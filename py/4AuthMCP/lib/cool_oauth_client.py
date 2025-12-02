import requests

# Server configuration
BASE_URL = "http://localhost:4000"
CLIENT_ID = "my-mcp-client"
CLIENT_SECRET = "super-secret-key-12345"

def check_token(token: str) -> bool:
    response = requests.post(
        f"{BASE_URL}/introspect",
        data={
            "token": token,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET
        }
    )
    response.raise_for_status()
    data = response.json()
    
    if data.get("client_id") != CLIENT_ID:
        raise ValueError(f"Client ID mismatch: expected '{CLIENT_ID}', got '{data.get('client_id')}'")
    
    return True