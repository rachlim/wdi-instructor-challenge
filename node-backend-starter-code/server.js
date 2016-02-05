const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const logger = require('morgan')
const path = require('path')

var db

MongoClient.connect('mongodb://zellwk:zellwk@ds055485.mongolab.com:55485/movie-challenge', (err, database) => {
  if (err) return console.log(err)
  db = database

  if (require.main === module) {
    const server = app.listen(process.env.PORT || 3000, function () {
      var host = server.address().address
      var port = server.address().port
      console.log('Listening on http://%s:%s', host, port)
    })
  }
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Development with Webpack
if (process.env.NODE_ENV !== 'production') {
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

app.use(express.static(__dirname + '/public'))

app.get('/api/favorites', (req, res) => {
  db.collection('favorites').find().toArray((err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.post('/api/favorites', (req, res) => {
  // Sets _id to movie ID
  req.body._id = req.body.id
  db.collection('favorites').save(req.body, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/api/favorites', (req, res) => {
  db.collection('favorites').findOneAndDelete(
    {_id: req.body.id},
    (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    }
  )
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})
