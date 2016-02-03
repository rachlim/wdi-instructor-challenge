import React from 'react'
import { Link } from 'react-router'

const MoviesList = ({movies, onMovieClick}) => {
  return (
    <ul>
      {movies.map(m => {
        return (
          <li key={m.id}>
            <img src={m.poster} />
            <Link to={`movie/${m.id}`} onClick={(e) => {
              console.log(e);
              onMovieClick(e, m.id, m.title)}
            }> {m.title} </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default MoviesList
