import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", // Set the host to 127.0.0.1
    port: 3000, // Specify the port here
  },
});
