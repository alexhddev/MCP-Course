

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

export async function getDailyMenu():Promise<MenuResponse> {
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
