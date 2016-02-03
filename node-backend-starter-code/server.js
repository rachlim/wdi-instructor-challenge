const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan')
const path = require('path')

// Standard Express stuff
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Development with Webpack
if (!process.env.production) {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('./webpack.config').development
  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {colors: true}
  }))
  app.use(webpackHotMiddleware(compiler))
  app.use(logger('dev'))
}

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

if (require.main === module) {
  const server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Listening on http://%s:%s', host, port)
  })
}
