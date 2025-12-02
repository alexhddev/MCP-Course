// Server configuration
const BASE_URL = "http://localhost:4000";
const CLIENT_ID = "my-mcp-client";
const CLIENT_SECRET = "super-secret-key-12345";

interface IntrospectionResponse {
    active: boolean;
    client_id?: string;
    [key: string]: unknown;
}

export async function checkToken(token: string): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/introspect`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            token,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        })
    });

    if (!response.ok) {
        throw new Error(`Introspection failed: ${response.status} ${response.statusText}`);
    }   

    const data: IntrospectionResponse = await response.json();

    if (data.client_id !== CLIENT_ID) {
        throw new Error(`Client ID mismatch: expected '${CLIENT_ID}', got '${data.client_id}'`);
    }

    if (!data.active) {
        throw new Error("Token is not active");
    }

    return true;
}