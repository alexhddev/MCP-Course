import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';

export const server = new McpServer({
    name: 'Hello name MCP',
    version: '1.0.0'
})

server.registerTool(
    'HelloName',
    {
        title: 'Hello name',
        description: 'Says hello to the provided name',
        inputSchema: {
            name: z.string()
        },
    },
    async ({ name }) => {
        return {
            content:[{
                type: 'text',
                text: `Hello ${name}! You are awesome`
            }]
        }

    }
)