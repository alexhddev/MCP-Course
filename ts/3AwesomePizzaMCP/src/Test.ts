import { getDailyMenu } from './ApiClient'

async function main() {
    const response = await getDailyMenu()
    console.log(response)
}

main()