const { run } = require('./build')

const files = ['dist/logger.js']

run('rollup.logger.config.js', files)
