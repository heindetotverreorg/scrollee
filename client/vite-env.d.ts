interface ImportMetaEnv {
    readonly VITE_S_PORT: number
    readonly VITE_WS_PORT: number
    readonly VITE_WS_HOST: string
    readonly VITE_WS_PROTOCOL: string
   
  }
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}