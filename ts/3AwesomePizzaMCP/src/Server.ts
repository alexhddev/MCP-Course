import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as apiClient from './ApiClient'

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
            content: [{
                type: 'text',
                text: 'Hello from test tool'
            }]
        }
    }
)

server.registerTool(
    'Get-pizza-menu',
    {
        title: 'Get pizza menu',
        description: 'Returns the awesome pizza menu'
    },
    async () => {
        const responseMenu = await apiClient.getDailyMenu();
        const toolResponse = []

        if (responseMenu.success) {
            responseMenu.data.forEach(menuEntry => {
                toolResponse.push({
                    type: 'text' as const,
                    text: menuEntry.name
                }
                )
            })
        } else {
            toolResponse.push({
                type: 'text' as const,
                text: responseMenu.message!
            })
        } return {
            content: toolResponse
        }
    }
)
