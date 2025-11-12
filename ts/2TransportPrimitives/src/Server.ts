import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { join } from "path";
import { readFileSync } from "fs";

export const server = new McpServer({
    name: 'Hello name MCP',
    version: '1.0.0'
})

server.registerResource(
    'ItemPrice',
    new ResourceTemplate(
        'items://{id}/price',
        { list: undefined }
    ),
    {
        title: 'Item price',
        description: 'Get the price of an item by its ID'
    },
    (uri, { id }) => {
        let price = 'Item not found'
        if (id == '42') {
            price = '19.99 USD'
        }
        if (id == '7') {
            price = '5.49 USD'
        }
        return {
            contents: [
                {
                    uri: uri.href,
                    text: price
                }
            ]
        }
    }
)







server.registerResource(
    'ReadLogs',
    'file:///data/logs.txt',
    {
        title: 'Read logs',
        description: 'Read and return the contents of data/logs.txt',
        mimeType: 'text/plain'
    },
    (uri) => {
        const logPath = join(process.cwd(), 'data', 'logs.txt');
        const logContents = readFileSync(logPath, 'utf-8');

        return {
            contents: [
                {
                    uri: uri.href,
                    text: logContents
                }
            ]
        }

    }
)










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
            content: [{
                type: 'text',
                text: `Hello ${name}! You are awesome`
            }]
        }

    }
)