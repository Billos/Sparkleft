import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://api-docs.firefly-iii.org/firefly-iii-6.4.17-v1.yaml',
  output: './sdk/firefly/core',
  plugins: ['@hey-api/typescript'],
});
