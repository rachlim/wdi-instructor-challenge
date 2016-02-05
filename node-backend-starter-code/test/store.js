import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from '../js/reducers'

let initialState = {
  favorites: {
    fetched: false,
    movies: []
  },
  movies: []
}

const store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(thunkMiddleware))
)

export default store
