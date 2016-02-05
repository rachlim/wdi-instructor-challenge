var webpack = require('webpack')
var path = require('path')
// TODO: Extract CSS into separate file for production
// var ExtractTextPlugin = require('extract-text-webpack-plugin')

var mod = {
  loaders: [{
    test: /\.jsx?$/,
    exclude: /(node_modules)/,
    loaders: ['react-hot', 'babel-loader']
  }, {
    test: /\.scss$/,
    exclude: /(bower_components)/,
    loaders: [
      'style',
      'css?sourceMap',
      'autoprefixer?browsers=last 2 versions',
      'sass?sourceMap'
    ]
  }]
}

var sassLoader = {
  includePaths: [
    path.resolve(__dirname, './node_modules'),
    path.resolve(__dirname, './node_modules/support-for/sass'),
    path.resolve(__dirname, './bower_components')
  ]
}

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin()
]

var development = {
  context: __dirname,
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './js/main.jsx'
  ],
  output: {
    path: '/',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: '#source-map',
  module: mod,
  sassLoader: sassLoader,
  plugins: plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ]),
  stats: {
    colors: true
  }
}

var production = {
  context: __dirname,
  entry: ['./js/main.jsx'],
  output: {
    path: './',
    filename: 'bundle.js'
  },
  devtool: '#source-map',
  module: mod,
  sassLoader: sassLoader,
  plugins: plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compressor: {warnings: false}
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  ]),
  stats: {
    colors: true
  }
}

module.exports = production
module.exports.development = development
