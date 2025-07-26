import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from shared env file
const envPath = resolve(__dirname, process.env.NODE_ENV === 'production'
    ? './production.env'
    : './.env')

config({ path: envPath })

export const serverConfig = {
    serverPort: process.env.VITE_S_PORT || 3001,
    wsPort: process.env.VITE_WS_PORT || 3002,
    wsHost: process.env.VITE_WS_HOST || '0.0.0.0',
}