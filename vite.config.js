import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/moo-cow-game/", // Thay đổi thành tên repository của bạn
  server: {
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
});
