interface ImportMetaEnv {
    readonly VITE_WS_SERVER: number
    readonly VITE_S_PORT: number
    readonly VITE_WS_PORT: number
    readonly VITE_WS_HOST: string
    readonly VITE_SERVER_DOMAIN: string
    readonly MONGO_URL: string
   
  }
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}