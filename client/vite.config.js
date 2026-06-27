import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Dev server proxies /api -> backend (default http://localhost:3001)
// so the frontend can call a relative "/api/generate" with no CORS concerns.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true,
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
            },
        },
    },
});
