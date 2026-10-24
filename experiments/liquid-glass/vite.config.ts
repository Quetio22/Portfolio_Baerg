import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tailwind()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    minify: true,
    outDir: fileURLToPath(
      new URL("../../assets/liquid-glass/", import.meta.url),
    ),
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/main.tsx", import.meta.url)),
      formats: ["es"],
      fileName: "glass",
      cssFileName: "glass",
    },
    sourcemap: false,
  },
});
