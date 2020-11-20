const fs = require('fs-extra')
const chalk = require('chalk')
const execa = require('execa')
const { gzipSync } = require('zlib')
const { compress } = require('brotli')

async function run(config, files) {
  await Promise.all([
    build(config),
    copy()
  ])
  checkAllSizes(files)
}

async function build(config) {
  await execa('rollup', ['-c', config], { stdio: 'inherit' })
}

async function copy() {
  await fs.copy(
    'src/index.mjs',
    'dist/vuex.mjs'
  )
}

function checkAllSizes(files) {
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

module.exports = { run }
