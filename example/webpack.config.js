var vue = require('vue-loader')

module.exports = {
  entry: './example/src/index.js',
  output: {
    path: './example/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: vue.withLoaders({
          js: 'babel?optional[]=runtime'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/src/,
        loader: 'babel?optional[]=runtime'
      }
    ]
  },
  devtool: 'source-map'
}
