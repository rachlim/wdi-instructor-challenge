import fetch from 'isomorphic-fetch'

export const requestMovies = (searchTerm) => {
  return {
    type: 'REQUEST_MOVIES',
    title: searchTerm
  }
}

export const receiveMovies = (movies) => {
  return {
    type: 'RECEIVE_MOVIES',
    movies: movies,
    receivedAt: Date.now()
  }
}

export const fetchMoviesFail = (movies, err) => {
  return {
    type: 'FETCH_MOVIES_FAILURE',
    err
  }
}

// Thunk
export function fetchMovies (searchTerm) {
  return function (dispatch) {
    dispatch(requestMovies())

    return fetch(`http://www.omdbapi.com/?s=${searchTerm}&type=movie`)
    .then(r => { if (r.ok) return r.json() })
    .then(r => {
      if (r.Response === 'False') {
        return dispatch(fetchMoviesFail(searchTerm, r.Error))
      }

      let movies = r.Search.map(el => {
        return {
          title: el.Title,
          poster: el.Poster,
          year: el.Year,
          id: el.imdbID
        }
      })

      dispatch(receiveMovies(movies))
    })
    .catch(e => dispatch(fetchMoviesFail(searchTerm, e)))
  }
}

export const requestMovie = (id) => {
  return {
    type: 'REQUEST_MOVIE',
    id
  }
}

export const receiveMovie = (movie) => {
  return {
    type: 'RECEIVE_MOVIE',
    movie: movie
  }
}

export const receiveMovieFail = (title, err) => {
  return {
    type: 'RECEIVE_MOVIE_FAILURE',
    title,
    err
  }
}

export function fetchMovie (id) {
  return function (dispatch) {
    dispatch(requestMovie(id))
    return fetch(`http://www.omdbapi.com/?i=${id}&type=movie&plot=full`)
    .then(r => { if (r.ok) return r.json() })
    .then(r => {
      if (r.Response === 'False') {
        return dispatch(fetchMoviesFail(r.Error))
      }

      let movie = {
        title: r.Title,
        id: id,
        actors: r.Actors,
        director: r.Director,
        plot: r.Plot,
        poster: r.Poster,
        production: r.Production,
        rating: r.Rated,
        year: r.Year,
        imdbRating: r.imdbRating
      }

      dispatch(receiveMovie(movie))
    })
    .catch(e => dispatch(fetchMoviesFail(e)))
  }
}

export const addFavorite = (movie) => {
  return {
    type: 'ADD_FAVORITE',
    movie
  }
}

export const addFavoriteFail = (movie) => {
  return {
    type: 'ADD_FAVORITE_FAIL',
    movie
  }
}

export const addFavoriteRequest = (movie) => {
  return {
    type: 'ADD_FAVORITE_REQUEST',
    movie
  }
}

export const removeFavorite = (movie) => {
  return {
    type: 'REMOVE_FAVORITE',
    movie
  }
}

export const removeFavoriteRequest = (movie) => {
  return {
    type: 'REMOVE_FAVORITE_REQUEST',
    movie
  }
}

export const saveFavorite = (movie) => {
  return (dispatch) => {
    dispatch(addFavoriteRequest(movie))
    fetch('http://localhost:3000/api/favorites', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(movie)
    })
    .then(r => {
      if (r.ok) return r.json()
    })
    .then(r => {
      if (r.ok) return dispatch(addFavorite(movie))
    })
    .catch(e => {
      // Placeholder for errors
      return console.log(e)
    })
  }
}

export const deleteFavorite = (movie) => {
  return (dispatch) => {
    dispatch(removeFavoriteRequest(movie))
    fetch('/api/favorites', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(movie)
    })
    .then(r => { if (r.ok) return r.json() })
    .then(r => {
      if (r.ok) {
        dispatch(removeFavorite(movie))
      }
    })
    .catch(e => {
      // Placeholder for errors
      return console.log(e)
    })
  }
}

export const requestFavorites = (id, title) => {
  return {
    type: 'REQUEST_FAVORITES',
    title,
    id
  }
}

export const receiveFavorites = (favorites) => {
  return {
    type: 'RECEIVE_FAVORITES',
    movies: favorites
  }
}

export const receiveFavoritesFail = (err) => {
  return {
    type: 'RECEIVE_FAVORITES_FAILURE',
    err
  }
}

export function fetchFavorites () {
  return (dispatch) => {
    dispatch(requestFavorites())
    return fetch(`/api/favorites`)
    .then(r => { if (r.ok) return r.json() })
    .then(r => {
      dispatch(receiveFavorites(r))
    })
  }
}
