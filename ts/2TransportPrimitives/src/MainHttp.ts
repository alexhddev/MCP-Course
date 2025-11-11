import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { server } from './Server'
import express from 'express';

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) =>{

    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    })

    res.on('close', ()=>{
        transport.close()
    })

    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
})

const port = 4000
app.listen(port, ()=>{
        console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
}).on('error', error =>{
    console.error('Server error ' + error)
    process.exit(1)
})