import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const server = new McpServer({
    name: 'awesome-pizza-mcp-ts',
    version: '1.0.0'
})

server.registerTool(
    'Test-tool',
    {
        title: 'test tool',
        description: 'test tool'
    },
    () => {
        return {
            content:[{
                type: 'text',
                text: 'Hello from test tool'
            }]
        }
    }
)
