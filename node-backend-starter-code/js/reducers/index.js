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

const favorite = (state = [], type, movie) => {
  switch (type) {
    case 'ADD_FAVORITE': return [...state, movie]
    case 'REMOVE_FAVORITE':
      return state.filter(el => el.id !== movie.id)
    default: return state
  }
}

const favorites = (state = {}, {type, movie, movies}) => {
  switch (type) {
    case 'ADD_FAVORITE':
    case 'REMOVE_FAVORITE':
      return Object.assign({},
        state, {
          movies: favorite(state.movies, type, movie)
        }
      )
    case 'RECEIVE_FAVORITES':
      return Object.assign({}, state, {
        fetched: true,
        movies: movies
      })
    default:
      return state
  }
}

const combined = combineReducers({
  movies,
  movie,
  favorites
  // routing: routeReducer
})

export default combined
