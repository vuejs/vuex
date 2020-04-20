import { createEntries } from './rollup.config'

export default createEntries([
  { input: 'src/index.js', file: 'dist/vuex.esm-browser.js', format: 'es', browser: true, env: 'development' },
  { input: 'src/index.js', file: 'dist/vuex.esm-browser.prod.js', format: 'es', browser: true, env: 'production' },
  { input: 'src/index.js', file: 'dist/vuex.esm-bundler.js', format: 'es', env: 'development' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.global.js', format: 'iife', env: 'development' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.global.prod.js', format: 'iife', minify: true, env: 'production' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.cjs.js', format: 'cjs', env: 'development' }
])
