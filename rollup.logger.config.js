import { createEntries } from './rollup.config'

export default createEntries([
  { input: 'src/plugins/logger.js', file: 'dist/logger.js', name: 'createVuexLogger', format: 'umd', env: 'development' }
])
