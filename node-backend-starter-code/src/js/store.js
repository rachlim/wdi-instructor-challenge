import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import reducers from './reducers'

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

export default store
