import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Vite config that mirrors the CRA jsconfig "baseUrl: ./src" so all the
// CRA-style bare imports ("Pages/...", "Components/...", "assets/...") resolve.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: false,
  },
  resolve: {
    alias: {
      Components: path.resolve(__dirname, "./src/Components"),
      Context: path.resolve(__dirname, "./src/Context"),
      Helpers: path.resolve(__dirname, "./src/Helpers"),
      Hooks: path.resolve(__dirname, "./src/Hooks"),
      Layout: path.resolve(__dirname, "./src/Layout"),
      Pages: path.resolve(__dirname, "./src/Pages"),
      Utilities: path.resolve(__dirname, "./src/Utilities"),
      assets: path.resolve(__dirname, "./src/assets"),
      data: path.resolve(__dirname, "./src/data"),
      form: path.resolve(__dirname, "./src/form"),
    },
  },
});
