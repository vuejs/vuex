const fs = require('fs-extra')
const chalk = require('chalk')
const execa = require('execa')
const { gzipSync } = require('zlib')
const { compress } = require('brotli')

const files = [
  'dist/vuex.esm-browser.js',
  'dist/vuex.esm-browser.prod.js',
  'dist/vuex.esm-bundler.js',
  'dist/vuex.global.js',
  'dist/vuex.global.prod.js',
  'dist/vuex.cjs.js'
]

async function run() {
  await Promise.all([build(), copy()])
  checkAllSizes()
}

async function build() {
  await execa('rollup', ['-c', 'rollup.config.js'], { stdio: 'inherit' })
}

async function copy() {
   await fs.copy('src/index.mjs', 'dist/vuex.mjs')
 }

function checkAllSizes() {
  console.log()
  files.map((f) => checkSize(f))
  console.log()
}

function checkSize(file) {
  const f = fs.readFileSync(file)
  const minSize = (f.length / 1024).toFixed(2) + 'kb'
  const gzipped = gzipSync(f)
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
  const compressed = compress(f)
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
  console.log(
    `${chalk.gray(
      chalk.bold(file)
    )} size:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
  )
}

run()
