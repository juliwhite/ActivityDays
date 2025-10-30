import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';

// __dirname equivalent in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
      },
    },
  },
});