import buble from '@rollup/plugin-buble'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const banner = `/*!
 * vuex v${pkg.version}
 * (c) ${new Date().getFullYear()} Evan You
 * @license MIT
 */`

const configs = [
  { input: 'src/index.js', file: 'dist/vuex.esm-browser.js', format: 'es', browser: true, env: 'development' },
  { input: 'src/index.js', file: 'dist/vuex.esm-browser.prod.js', format: 'es', browser: true, env: 'production' },
  { input: 'src/index.js', file: 'dist/vuex.esm-bundler.js', format: 'es', env: 'development' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.global.js', format: 'iife', env: 'development' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.global.prod.js', format: 'iife', minify: true, env: 'production' },
  { input: 'src/index.cjs.js', file: 'dist/vuex.cjs.js', format: 'cjs', env: 'development' }
]

function createEntries() {
  return configs.map((c) => createEntry(c))
}

function createEntry(config) {
  const c = {
    external: ['vue'],
    input: config.input,
    plugins: [],
    output: {
      banner,
      file: config.file,
      format: config.format,
      globals: {
        vue: 'Vue'
      }
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  if (config.format === 'iife' || config.format === 'umd') {
    c.output.name = c.output.name || 'Vuex'
  }

  c.plugins.push(replace({
    __VERSION__: pkg.version,
    __DEV__: config.format !== 'iife' && !config.browser
      ? `(process.env.NODE_ENV !== 'production')`
      : config.env !== 'production'
  }))

  if (config.transpile !== false) {
    c.plugins.push(buble())
  }

  c.plugins.push(resolve())
  c.plugins.push(commonjs())

  if (config.minify) {
    c.plugins.push(terser({ module: config.format === 'es' }))
  }

  return c
}

export default createEntries()
