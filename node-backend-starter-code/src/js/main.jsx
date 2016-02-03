import '../scss/styles.scss'

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import reducers from './reducers'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import App from './components/App.jsx'

let initialState = {
  selectedTab: 'search',
  // favorites: [],
  movies: []
}

const store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(thunkMiddleware, createLogger()),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <Route path='/' component={App} />
    </Router>
  </Provider>,
  document.getElementById('app')
)
