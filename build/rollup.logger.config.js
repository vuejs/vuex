const buble = require('rollup-plugin-buble')

module.exports = {
  input: 'src/plugins/logger.js',
  output: {
    file: 'dist/logger.js',
    format: 'umd',
    name: 'createVuexLogger',
  },
  plugins: [buble()]
}
