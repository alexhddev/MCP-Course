import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

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

// Request logging middleware
app.use((req, res, next) => {
    console.log(`REQUEST: ${req.method} ${req.url}`, req.body);
    next();
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