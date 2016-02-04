import React from 'react'
import { Link } from 'react-router'

const MoviesList = ({movies, isFavorite = false, onMovieClick}) => {
  if (movies.length) {
    return (
      <ul>
        {movies.map(m => {
          return (
            <li key={m.id}>
              <img src={m.poster} />
              <Link to={`movie/${m.id}`}> {m.title} </Link>
            </li>
          )
        })}
      </ul>
    )
  } else if (isFavorite) {
    return (<div>No movies favorited yet :(</div>)
  } else {
    return (<div>Start searching for some movies! </div>)
  }
}

export default MoviesList
