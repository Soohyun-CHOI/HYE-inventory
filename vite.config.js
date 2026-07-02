import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// During local dev, run `vercel dev` instead of `vite dev` so that the
// /api serverless functions are also served. Plain `vite dev` only serves
// the frontend and /api/* calls will 404.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
    },
});
