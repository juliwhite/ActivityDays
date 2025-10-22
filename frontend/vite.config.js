import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  //root: "src",
  build: {
    //outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(new URL('./src/index.html', import.meta.url).pathname),
        login: resolve(new URL('./src/login.html', import.meta.url).pathname),
        signup: resolve(new URL('./src/signup.html', import.meta.url).pathname ),
      },
    },
  },
});