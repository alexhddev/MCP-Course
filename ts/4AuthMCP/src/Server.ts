import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

// auth imports:
import { authMiddleware } from './lib/Auth'
import { corsMiddleware } from './lib/Cors'

const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0'
});

server.registerTool(
    'hello',
    {
        title: 'Hello MCP tool',
        description: 'Hello MCP tool',
    },
    () => {
        console.log('[MCP] Tool called: hello');
        return {
            content: [{ type: 'text' as const, text: "Hello from MCP" }],
        };
    }
);

// Set up Express and HTTP transport
const app = express();
app.use(express.json());
app.use(authMiddleware);
app.use(corsMiddleware);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`REQUEST: ${req.method} ${req.url}`, req.body);
    next();
});

// OAuth protected resource metadata endpoint
app.get('/.well-known/oauth-protected-resource/mcp', (req, res) => {
    res.json({
        authorization_servers: ['http://localhost:4000/authorize'],
        bearer_methods_supported: ['header', 'body'],
        resource: 'http://localhost:8000/mcp',
        scopes_supported: ['mcp:tools:search:read'],
    });
});

// OAuth authorization server metadata endpoint
app.get('/.well-known/oauth-authorization-server', (req, res) => {
    console.log('[OAuth] GET /.well-known/oauth-authorization-server');
    res.json({
        issuer: 'http://localhost:4000',
        authorization_endpoint: 'http://localhost:4000/authorize',
        token_endpoint: 'http://localhost:4000/token',
        registration_endpoint: 'http://localhost:4000/register',
        response_types_supported: ['code'],
        grant_types_supported: ['authorization_code'],
        code_challenge_methods_supported: ['S256'],
        scopes_supported: ['mcp:tools:search:read'],
    });
});

app.post('/mcp', async (req, res) => {
    console.log('[MCP] POST /mcp - Incoming request');
    console.log('[MCP] Request body:', JSON.stringify(req.body, null, 2));
    // Create a new transport for each request to prevent request ID collisions
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined
    });

    await server.connect(transport);
    console.log('[MCP] Transport connected, handling request...');
    await transport.handleRequest(req, res, req.body);
    console.log('[MCP] Request handled successfully');
});

app.listen(8000, () => {
    console.log(`Demo MCP Server running on http://localhost:8000/mcp`);
}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});