import React from 'react'
import { Link } from 'react-router'

const MoviesList = ({movies}) => {
  return (
    <ul>
      {movies.map(m => {
        return (
          <li key={m.id}>
            <Link to={`/movie/${m.id}`}> {m.title} </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default MoviesList
