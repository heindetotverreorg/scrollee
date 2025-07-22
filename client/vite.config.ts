import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "../");
  return defineConfig({
    define: {
      "process.env": env,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, '../shared')
      },
    },
    plugins: [vue()],
    server: {
      port: 3000,
    },
    build: {
      outDir: '../dist/client',
    },
    root: './client',
    envDir: '../',
  });
};