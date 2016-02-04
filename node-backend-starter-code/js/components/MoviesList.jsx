import React from 'react'
import { Link } from 'react-router'

const MoviesList = ({movies, isFavorite = false, onMovieClick}) => {
  if (movies.length) {
    return (
      <ul className='movieList'>
        {movies.map(m => {
          return (
            <li key={m.id}>
              <figure>
                <img src={m.poster} />
              </figure>
              <div className='movieList__content'>
                <h3><Link to={`movie/${m.id}`}> {m.title} </Link></h3>
                <p>{m.year}</p>
              </div>
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
