import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'
import { defaultDocumentNode } from './structure/defaultDocumentNode'
import { dataCleanupTool } from './dataCleanupTool'

export default defineConfig({
  name: 'default',
  title: 'Day',

  projectId: 'bdqou49k',
  dataset: 'production',

  plugins: [structureTool({ structure, defaultDocumentNode }), visionTool()],

  schema: {
    types: schemaTypes,
  },
  tools: (prev, { currentUser }) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')

    if (isAdmin) {
      return [...prev, dataCleanupTool()]
    }

    return prev.filter((tool) => tool.name !== 'vision')
  },
})
