import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "https://api-docs.firefly-iii.org/firefly-iii-6.4.17-v1.yaml",
  output: {
    path: "./src/types",
    format: "prettier",
  },
})
