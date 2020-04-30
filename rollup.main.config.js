import { createEntries } from './rollup.config'

export default createEntries([
  { input: 'src/index.js', file: 'dist/vuex.esm.browser.js', format: 'es', browser: true, transpile: false, env: 'development' },
  { input: 'src/index.js', file: 'dist/vuex.esm.browser.min.js', format: 'es', browser: true, transpile: false, minify: true, env: 'production' },
  { input: 'src/index.js', file: 'dist/vuex.esm.js', format: 'es', env: 'development' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.js', format: 'umd', env: 'development' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.min.js', format: 'umd', minify: true, env: 'production' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.common.js', format: 'cjs', env: 'development' }
])
