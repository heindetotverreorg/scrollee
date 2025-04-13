interface ImportMetaEnv {
    readonly VITE_S_PORT: 3001
    readonly VITE_WS_PORT: 3002
   
  }
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}