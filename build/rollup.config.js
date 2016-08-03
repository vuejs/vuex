const buble = require('rollup-plugin-buble')
const version = process.env.VERSION || require('../package.json').version

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/vuex.js',
  format: 'umd',
  moduleName: 'Vuex',
  plugins: [buble()],
  banner:
`/**
 * vuex v${version}
 * (c) ${new Date().getFullYear()} Evan You
 * @license MIT
 */`
}
