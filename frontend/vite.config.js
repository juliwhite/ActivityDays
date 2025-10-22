import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from 'url';

const __filename =  fileURLToPath(import.meta.url);
const __dirname =  resolve(__filename, '..');

export default defineConfig({
  build: {
    //outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/login.html'),
        signup: resolve(__dirname, 'src/signup.html'),
      },
    },
  },
});