import { combineReducers } from 'redux'

export const movies = (state = [], {type, movies}) => {
  switch (type) {
    case 'RECEIVE_MOVIES':
      return [...movies]
    default:
      return state
  }
}

export const movie = (state = {}, {type, movie}) => {
  switch (type) {
    case 'RECEIVE_MOVIE':
      let newState = Object.assign({}, state)
      newState[movie.id] = movie
      return newState
    default:
      return state
  }
}

export const favorite = (state = [], {type, movie}) => {
  switch (type) {
    case 'ADD_FAVORITE':
      return [...state, movie]
    case 'REMOVE_FAVORITE':
      return state.filter(el => el.id !== movie.id)
    default: return state
  }
}

export const favorites = (state = {}, {type, movie, movies}) => {
  switch (type) {
    case 'ADD_FAVORITE':
    case 'REMOVE_FAVORITE':
      return Object.assign({},
        state, {
          movies: favorite(state.movies, {type, movie})
        }
      )
    case 'RECEIVE_FAVORITES':
      return Object.assign({}, state, {
        fetched: true,
        movies: [...state.movies, ...movies]
      })
    default:
      return state
  }
}

const combined = combineReducers({
  movies,
  movie,
  favorites
})

export default combined
