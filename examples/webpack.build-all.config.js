var path = require('path')

var examples = [
  'chat',
  'counter',
  'counter-hot',
  'shopping-cart',
  'todomvc'
]

var entry = {}
examples.forEach(function (name) {
  entry[name] = ['./examples/' + name + '/main.js']
})

module.exports = {
  entry: entry,
  output: {
    path: __dirname,
    filename: '[name]/build.js'
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
  }
}
