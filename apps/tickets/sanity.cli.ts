import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  server: {
    port: 3334,
  },
  deployment: {
    appId: 'ox0r8qicpgrk6pwydrfit1sr',
  },
  app: {
    organizationId: 'onlEen41B',
    entry: './src/App.tsx',
  },
})
