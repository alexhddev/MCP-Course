import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import * as quotesService from './QuotesService'

const server = new McpServer({
    name: 'AXBV-quotes-server',
    version: '1.0.0'
})

server.registerTool(
    'Ged-AXBV-sad-quote',
    {},
    ()=>{
        return {
            content: [{
                type: 'text',
                text: quotesService.getSadQuote()
            }]
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
