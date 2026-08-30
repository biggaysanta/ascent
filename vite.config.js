import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    origin: "http://localhost:1313",
    cors: true,
    strictPort: true,
  },
  build: {
    outDir: "static",
    lib: {
      entry: "themes/embrace/assets/js/main.js",
      name: "FirelightStudio",
      formats: ["es", "umd"],
    },
  },
});
