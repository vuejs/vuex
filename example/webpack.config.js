module.exports = {
  entry: './example/src/index.js',
  output: {
    path: './example/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' }
    ]
  },
  devtool: 'source-map'
}
