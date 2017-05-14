const path = require('path')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version
const banner =
`/**
 * vuex v${version}
 * (c) ${new Date().getFullYear()} Evan You
 * @license MIT
 */`

const resolve = _path => path.resolve(__dirname, '../', _path)

const configs = {
  browserDev: {
    entry: resolve('src/index.js'),
    dest: resolve('dist/vuex.js'),
    format: 'umd',
    env: 'development'
  },
  browserProd: {
    entry: resolve('src/index.js'),
    dest: resolve('dist/vuex.min.js'),
    format: 'umd',
    env: 'production'
  },
  commonjs: {
    entry: resolve('src/index.js'),
    dest: resolve('dist/vuex.common.js'),
    format: 'cjs'
  },
  esm: {
    entry: resolve('src/index.esm.js'),
    dest: resolve('dist/vuex.esm.js'),
    format: 'es'
  }
}

function genConfig (opts) {
  const config = {
    entry: opts.entry,
    dest: opts.dest,
    format: opts.format,
    banner,
    moduleName: 'Vuex',
    plugins: [
      replace({
        __VERSION__: version
      }),
      buble()
    ]
  }

  if (opts.env) {
    config.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}

function mapValues (obj, fn) {
  const res = {}
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key)
  })
  return res
}

module.exports = mapValues(configs, genConfig)
