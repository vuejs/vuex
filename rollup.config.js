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

export function createEntries(configs) {
  return configs.map((c) => createEntry(c))
}

function createEntry(config) {
  const c = {
    input: config.input,
    plugins: [],
    output: {
      banner,
      file: config.file,
      format: config.format
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  if (config.format === 'umd') {
    c.output.name = c.output.name || 'Vuex'
  }

  c.plugins.push(replace({
    __VERSION__: pkg.version,
    __DEV__: config.format !== 'umd' && !config.browser
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
