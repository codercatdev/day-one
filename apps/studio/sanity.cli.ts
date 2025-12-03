import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'bdqou49k',
    dataset: 'production'
  },
  deployment: {  
    appId: 'nvq6k04ljmiyg95oxsdjwnqc',
    autoUpdates: true,
  }
})
