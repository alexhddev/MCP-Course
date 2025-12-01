import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = 4000;

// Hardcoded client credentials (for learning purposes only - never do this in production!)
const CLIENT_ID = 'my-mcp-client';
const CLIENT_SECRET = 'super-secret-key-12345';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log middleware - logs all requests
app.use((req, res, next) => {
    console.log(`REQUEST for ${req.method} ${req.url}`);
    next();
});

// Add CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// In-memory storage for authorization codes and tokens (use a database in production)
const authCodes: Record<string, any> = {};
const accessTokens: Record<string, any> = {};

// Helper function to generate URL-safe random tokens
function generateToken(length: number = 32): string {
    const token = crypto.randomBytes(length).toString('base64url');
    return token
}

// Authorization endpoint - presents login page
app.get('/authorize', (req, res) => {
    console.log('AUTHORIZE: Received request');
    console.log('AUTHORIZE: Query params:', req.query);
    
    const {
        response_type,
        client_id,
        redirect_uri,
        state,
        code_challenge,
        code_challenge_method,
        scope = ''
    } = req.query;

    console.log('AUTHORIZE: State received:', state);

    // Validate client_id
    if (client_id !== CLIENT_ID) {
        return res.status(400).json({ error: 'invalid_client', error_description: 'Unknown client_id' });
    }

    // Store the authorization request parameters
    const requestId = generateToken(16);
    authCodes[requestId] = {
        client_id,
        redirect_uri,
        state,
        code_challenge,
        code_challenge_method,
        scope,
        used: false
    };

    console.log('AUTHORIZE: Stored state:', authCodes[requestId].state);

    // Return a simple HTML form for user authorization
    const htmlContent = `
    <html>
        <head><title>Authorize MCP Server</title></head>
        <body>
            <h2>Authorization Required</h2>
            <p>Client ID: ${client_id}</p>
            <p>Scopes: ${scope || "default"}</p>
            <form method="post" action="/authorize/approve">
                <input type="hidden" name="request_id" value="${requestId}"/>
                <button type="submit">Authorize</button>
            </form>
        </body>
    </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
});

// Authorization approval endpoint
app.post('/authorize/approve', (req, res) => {
    const { request_id } = req.body;

    if (!request_id || !authCodes[request_id]) {
        return res.status(400).json({ detail: 'Invalid request' });
    }

    const authData = authCodes[request_id];

    // Generate authorization code
    const code = generateToken(32);
    console.log('AUTH CODE GENERATED:', code);
    authCodes[code] = authData;

    // Build redirect URL with proper encoding
    const redirectUrl = new URL(authData.redirect_uri);
    redirectUrl.searchParams.set('code', code);
    if (authData.state) {
        redirectUrl.searchParams.set('state', authData.state);
    }
    
    console.log('REDIRECT: Redirecting to:', redirectUrl.toString());
    console.log('REDIRECT: State being sent:', authData.state);
    
    res.redirect(302, redirectUrl.toString());
});

// Token endpoint - exchanges authorization code for access token
app.post('/token', (req, res) => {
    const {
        grant_type,
        code,
        redirect_uri,
        client_id,
        client_secret,
        code_verifier
    } = req.body;

    // Validate client credentials
    if (client_id !== CLIENT_ID) {
        return res.status(401).json({ error: 'invalid_client', error_description: 'Unknown client_id' });
    }
    if (client_secret !== CLIENT_SECRET) {
        return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client_secret' });
    }

    if (grant_type !== 'authorization_code') {
        return res.status(400).json({ detail: 'Unsupported grant type' });
    }

    if (!code || !authCodes[code]) {
        return res.status(400).json({ detail: 'Invalid authorization code' });
    }

    const authData = authCodes[code];

    if (authData.used) {
        return res.status(400).json({ detail: 'Authorization code already used' });
    }

    if (authData.client_id !== client_id) {
        return res.status(400).json({ detail: 'Client ID mismatch' });
    }

    if (authData.redirect_uri !== redirect_uri) {
        return res.status(400).json({ detail: 'Redirect URI mismatch' });
    }

    // Verify PKCE code challenge
    const hash = crypto.createHash('sha256').update(code_verifier).digest();
    const codeChallenge = hash.toString('base64url');

    if (codeChallenge !== authData.code_challenge) {
        return res.status(400).json({ detail: 'Invalid code verifier' });
    }

    // Mark code as used
    authData.used = true;

    // Generate access token
    const accessToken = generateToken(32);
    accessTokens[accessToken] = {
        client_id,
        scope: authData.scope
    };

    res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: authData.scope
    });
});

app.post('/printtokens', (req, res) => {
    console.log(accessTokens)
})

// Token introspection endpoint - checks token validity
app.post('/introspect', (req, res) => {
    const { token, client_id, client_secret } = req.body;

    // Validate client credentials
    if (client_id !== CLIENT_ID) {
        return res.status(401).json({ error: 'invalid_client', error_description: 'Unknown client_id' });
    }
    if (client_secret !== CLIENT_SECRET) {
        return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client_secret' });
    }

    // Check if token is provided
    if (!token) {
        return res.status(400).json({ error: 'invalid_request', error_description: 'Token is required' });
    }

    // Check if token exists and is valid
    const tokenData = accessTokens[token];
    if (!tokenData) {
        // Token not found - return inactive per RFC 7662
        return res.json({ active: false });
    }

    // Token is valid - return token information
    return res.json({
        active: true,
        client_id: tokenData.client_id,
        scope: tokenData.scope,
        token_type: 'Bearer'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
