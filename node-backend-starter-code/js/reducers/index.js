import { combineReducers } from 'redux'
// import { routeReducer } from 'react-router-redux'

const movies = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_MOVIES':
      return [...action.movies]
    default:
      return state
  }
}

const movie = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_MOVIE':
      let o = Object.assign({}, state)
      o[action.movie.id] = action.movie
      return o
    default:
      return state
  }
}

// const selectedTab = (state = 'search', action) => {
//   switch (action.type) {
//     case 'SET_SELECTED_TAB':
//       return action.filter
//     default:
//       return state
//   }
// }

const combined = combineReducers({
  // selectedTab,
  movies,
  movie
  // routing: routeReducer
})

export default combined
