import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://api-docs.firefly-iii.org/firefly-iii-6.4.17-v1.yaml',
  output: './src/sdk/firefly',
  plugins: [
    '@hey-api/typescript',
    {
      client: '@hey-api/client-axios',
      name: '@hey-api/sdk',
      operations: {
        containerName: '{{name}}Service',
        strategy: 'byTags',
      },
    },
  ],
});
