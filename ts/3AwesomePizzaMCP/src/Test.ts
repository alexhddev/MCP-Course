import { getDailyMenu, makeOrder } from './ApiClient'

async function main() {
    const response = await makeOrder({
        sender: 'Test',
        contents: [{
            name: 'Test',
            quantity: 1
        }]
    })
    console.log(response)
}

main()