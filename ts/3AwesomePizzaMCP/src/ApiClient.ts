

const baseUrl = 'http://localhost:3000/api'


type MenuResponse = {
    success: boolean
    data: {
        name: string
        description: string
        imageUrl: string
    }[]
    message?: string
}

type orderDetails = {
    sender: string,
    contents: {
        name: string,
        quantity: number
    }[]
}

export async function makeOrder(orderDetails: orderDetails): Promise<{
    orderId: string,
    success: boolean,
    message?: string
}> {
    try {
        const response = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        });
        const responseJSON = await response.json() 
        return {
            orderId: responseJSON.data.id,
            success: true
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            orderId: ''
        }
    }




}



export async function getDailyMenu(): Promise<MenuResponse> {
    try {
        const response = await fetch(`${baseUrl}/daily-menu`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json() as MenuResponse
        return data;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            data: []
        };
    }
}
