import React from 'react'
import { connect } from 'react-redux'
import { fetchMovies } from '../actions'

let SearchMovies = ({dispatch}) => {
  let input
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      dispatch(fetchMovies(encodeURIComponent(input.value)))
      input.value = ''
    }}>
      <input ref={node => {
        input = node
      }} />
      <button type='submit'>Search for Movie </button>
    </form>
  )
}

SearchMovies = connect()(SearchMovies)

export default SearchMovies
