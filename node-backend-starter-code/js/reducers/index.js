import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'

const movies = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return [...state, {
        title: action.title,
        id: action.id
      }]
    case 'RECEIVE_MOVIES':
      return [...action.movies]
    default:
      return state
  }
}

const selectedTab = (state = 'search', action) => {
  switch (action.type) {
    case 'SET_SELECTED_TAB':
      return action.filter
    default:
      return state
  }
}

const combined = combineReducers({
  selectedTab,
  movies,
  routing: routeReducer
})

export default combined
