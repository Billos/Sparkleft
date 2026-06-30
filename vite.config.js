import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

// Target depends if the node env is development or production
const isProduction = process.env.NODE_ENV === "production"

// Authorize production domain to access the backend API
const getApiTarget = () => {
  if (isProduction) {
    return null
  }
  console.log("Development mode: proxying API requests to http://server:3000")
  return "http://server:3000/"
}

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  root: "./frontend",
  base: "/control/",
  server: {
    host: "0.0.0.0", // Écouter sur toutes les interfaces (nécessaire pour Docker)
    port: 5173,
    allowedHosts: true,
    cors: {
      origin: true,
      credentials: true,
    },
    proxy: {
      "/api": {
        target: getApiTarget(),
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "../dist/frontend",
  },
})
