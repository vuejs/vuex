var path = require('path')

module.exports = {
  entry: './main.js',
  output: {
    path: process.cwd(),
    filename: 'build.js'
  },
  resolve: {
    alias: {
      vuex: path.resolve(__dirname, '../build/dev-entry')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules|vue\/dist|vue-hot-reload-api|vue-loader/
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  },
  devtool: '#source-map'
}
