import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'

let initialState = {
  favorites: {
    fetched: false,
    movies: []
  },
  movies: []
}

// Should this be the ideal state?
// var obj = {
//   favorites: {}, // cache this shit
//   searchTerm: 'Star Wars',
//   movies: {
//     'starwars': [{
//       page: 1,
//       isFetching: false,
//       items: []
//     }, {
//       page: 2,
//       isFetching: false,
//       items: []
//     }]
//   }
// }

const store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(
    thunkMiddleware
    // createLogger(),
  ), window.devToolsExtension ? window.devToolsExtension() : f => f)
)

export default store
