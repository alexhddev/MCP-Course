import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import * as quotesService from './QuotesService'
import { z } from 'zod'

const server = new McpServer({
    name: 'AXBV-quotes-server',
    version: '1.0.0'
})

server.registerTool(
    'Ged-AXBV-sad-quote',
    {},
    () => {
        return {
            content: [{
                type: 'text',
                text: quotesService.getSadQuote()
            }]
        }
    }
)

server.registerTool(
    'Ged-AXBV-happy-quote',
    {},
    () => {
        return {
            content: [{
                type: 'text',
                text: quotesService.getHappyQuote()
            }]
        }
    }
)

server.registerTool(
    'Ged-a-number-of-AXBV-quotes',
    {
        inputSchema: {
            count: z.number()
        }
    },
    ({ count }) => {
        try {
            const quotes = quotesService.getQuotes(count)
            const result = []
            for (const quote of quotes) {
                result.push({
                    type: 'text' as const,
                    text: quote
                })
            }
            return {
                content: result
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }
                ],
                isError: true
            }

        }

    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("AXBV quotes MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    //@ts-ignore
    process.exit(1);
});
