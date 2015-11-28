module.exports = {
  entry: './main.js',
  output: {
    path: __dirname,
    filename: 'example.build.js'
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
  babel: {
    presets: ['es2015']
  },
  devtool: 'source-map'
}
