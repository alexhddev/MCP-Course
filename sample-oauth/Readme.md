# Sample OAuth Server

A simple OAuth 2.0 authorization server implementation for testing and development purposes.

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Server

1. Start the OAuth server:
```bash
npm start
```

The server will start on `http://localhost:4000`.

## Sample Requests

The `requests.http` file contains example OAuth 2.0 flows. You can use these with VS Code's REST Client extension or any HTTP client.

### OAuth 2.0 Flow Examples

#### 1. Authorization Request
Navigate to this URL in your browser to start the OAuth flow:
```
http://localhost:4000/authorize?response_type=code&client_id=my-mcp-client&redirect_uri=http://localhost:3000/callback&state=xyz123&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256&scope=read
```

#### 2. Token Exchange
After getting the authorization code from step 1, exchange it for an access token:
```http
POST http://localhost:4000/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=YOUR_AUTH_CODE&redirect_uri=http://localhost:3000/callback&client_id=my-mcp-client&client_secret=super-secret-key-12345&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

#### 3. Token Introspection
Validate and get information about a token:
```http
POST http://localhost:4000/introspect
Content-Type: application/x-www-form-urlencoded

token=YOUR_ACCESS_TOKEN&client_id=my-mcp-client&client_secret=super-secret-key-12345
```

#### 4. Debug: View Stored Tokens
```http
POST http://localhost:4000/printtokens
```

### Configuration

The server uses these default values:
- **Client ID**: `my-mcp-client`
- **Client Secret**: `super-secret-key-12345`
- **Redirect URI**: `http://localhost:3000/callback`
- **Server Port**: `4000`

## Using VS Code REST Client

If you have the REST Client extension installed in VS Code:

1. Open the `requests.http` file
2. Click "Send Request" above each request block
3. Update the `@authCode` and `@accessToken` variables as needed

## Notes

- This is a sample implementation for testing purposes only
- The server stores tokens in memory (not persistent)