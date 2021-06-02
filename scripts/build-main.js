const { run } = require('./build')

const files = [
  'dist/vuex.esm.browser.js',
  'dist/vuex.esm.browser.min.js',
  'dist/vuex.esm.js',
  'dist/vuex.js',
  'dist/vuex.min.js',
  'dist/vuex.common.js'
]

run('rollup.main.config.js', files)
