const { run } = require('./build')

const files = [
  'dist/vuex.esm.js',
  'dist/vuex.esm.prod.js',
  'dist/vuex.esm-bundler.js',
  'dist/vuex.global.js',
  'dist/vuex.global.prod.js',
  'dist/vuex.cjs.js'
]

run('rollup.main.config.js', files)
