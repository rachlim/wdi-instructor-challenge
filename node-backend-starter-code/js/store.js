import createBrowserHistory from 'history/lib/createBrowserHistory'
import { createStore, applyMiddleware, compose } from 'redux'
import { syncHistory } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import reducers from './reducers'

let initialState = {
  selectedTab: 'search',
  // favorites: [],
  movies: []
}

export const history = createBrowserHistory()

const store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(
    thunkMiddleware, createLogger(), syncHistory(history)
  ), window.devToolsExtension ? window.devToolsExtension() : f => f)
)

export default store
