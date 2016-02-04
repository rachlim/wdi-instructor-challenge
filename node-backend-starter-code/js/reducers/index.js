import { combineReducers } from 'redux'
// import { routeReducer } from 'react-router-redux'

const movies = (state = [], {type, movies}) => {
  switch (type) {
    case 'RECEIVE_MOVIES':
      return [...movies]
    default:
      return state
  }
}

const movie = (state = {}, {type, movie}) => {
  switch (type) {
    case 'RECEIVE_MOVIE':
      let newState = Object.assign({}, state)
      newState[movie.id] = movie
      return newState
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

const favorites = (state = [], {type, movie}) => {
  switch (type) {
    case 'ADD_FAVORITE':
      return [...state, movie]
    case 'REMOVE_FAVORITE':
      return state.filter(el => {
        return el.id !== movie.id
      })
    default:
      return state
  }
}

const combined = combineReducers({
  // selectedTab,
  movies,
  movie,
  favorites
  // routing: routeReducer
})

export default combined
