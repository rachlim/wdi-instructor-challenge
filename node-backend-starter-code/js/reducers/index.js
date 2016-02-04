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
      let newState = Object.assign({}, state)
      newState[action.movie.id] = action.movie
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

const favorite = (state = [], action) => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return [...state, action.movie]
    case 'REMOVE_FAVORITE':
      return state.filter(el => {
        return el.id !== action.movie.id
      })
    default:
      return state
  }
}

const combined = combineReducers({
  // selectedTab,
  movies,
  movie,
  favorite
  // routing: routeReducer
})

export default combined
