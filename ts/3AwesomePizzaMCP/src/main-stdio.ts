import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './Server'

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    //@ts-ignore
    process.exit(1);
});