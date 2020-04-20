import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const banner = `/*!
 /**
  * vuex v${pkg.version}
  * (c) ${new Date().getFullYear()} Evan You
  * @license MIT
  */`

export function createEntries(configs) {
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
    __DEV__: config.format === 'es' && !config.browser
      ? `(process.env.NODE_ENV !== 'production')`
      : config.env !== 'production'
  }))

  c.plugins.push(resolve())
  c.plugins.push(commonjs())

  if (config.minify) {
    c.plugins.push(terser({ module: config.format === 'es' }))
  }

  return c
}
