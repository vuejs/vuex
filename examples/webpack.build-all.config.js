var examples = [
  'chat',
  'counter',
  'counter-hot',
  'shopping-cart',
  'todomvc'
]

var entry = {}
examples.forEach(function (name) {
  entry[name] = ['./build/bind.js', './examples/' + name + '/main.js']
})

module.exports = {
  entry: entry,
  output: {
    path: __dirname,
    filename: '[name]/build.js'
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
