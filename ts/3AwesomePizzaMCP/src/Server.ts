import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as apiClient from './ApiClient'
import z from "zod";

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


server.registerTool(
    'Get-pizza-menu-with-images',
    {
        title: 'Get pizza menu with images',
        description: 'Returns the awesome pizza menu with images'
    },
    async () => {
        const responseMenu = await apiClient.getDailyMenu();
        const toolResponse = []

        if (responseMenu.success) {
            for (const menuEntry of responseMenu.data) {
                const imageUrl = `http://localhost:3000/${menuEntry.imageUrl}`
                const base64Image = await imageUrlToBase64(imageUrl)

                toolResponse.push({
                    type: 'image' as const,
                    data: base64Image,
                    mimeType: 'image/png'
                })
                toolResponse.push({
                    type: 'text' as const,
                    text: menuEntry.name
                })
            }
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

server.registerTool(
    'make-order',
    {
        title: 'Make order tool',
        description: 'Make an order at awesome pizza',
        inputSchema: {
            items: z.array(z.object({
                name: z.string(),
                quantity: z.number()
            }))
        },
        outputSchema: {
            orderId: z.string()
        }

    },
    async ({ items }) => {
        const orderResponse = await apiClient.makeOrder({
            sender: 'awesomeMCP',
            contents: items
        });
        if (orderResponse.success) {
            return {
                content: [{
                    type: 'text',
                    text: `Order placed successfully! Order ID: ${orderResponse.orderId}`
                }],
                structuredContent: {
                    orderId: orderResponse.orderId
                }
            }
        } else {
            return {
                content: [{
                    type: 'text' as const,
                    text: `Failed to place order: ${orderResponse.message}`
                }],
                structuredContent: {
                    orderId: ''
                }
            };
        }
    }
)

server.registerTool(
    'Check-order-status',
    {
        title: 'Check order status',
        description: 'Returns the status of a order for awesome pizza based on the order ID',
        inputSchema: {
            orderId: z.string()
        }
    },
    async ({ orderId }) => {
        const orderStatus = await apiClient.checkOrderStatus(orderId)
        return {
            content: [{
                type: 'text',
                text: orderStatus
            }]
        }
    }
)







async function imageUrlToBase64(imageUrl: string): Promise<string> {
    try {
        const response = await fetch(imageUrl)
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString('base64');
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw error;
    }
}
