import fetch from 'isomorphic-fetch'

let nextMovieId = 0

export const addMovie = (title) => {
  return {
    type: 'ADD_MOVIE',
    id: nextMovieId++,
    title
  }
}

export const setSelectedTab = (filter) => {
  return {
    type: 'SET_SELECTED_TAB',
    filter
  }
}

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
    .then(r => r.json())
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

export const requestMovie = (id, title) => {
  return {
    type: 'REQUEST_MOVIE',
    title,
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

export function fetchMovie (id, title) {
  return function (dispatch) {
    dispatch(requestMovie(id, title))

    return fetch(`http://www.omdbapi.com/?i=${id}&type=movie&plot=full`)
    .then(r => r.json())
    .then(r => {
      if (r.Response === 'False') {
        return dispatch(fetchMoviesFail(title, r.Error))
      }

      let movie = {
        actors: r.Actors,
        director: r.Director,
        plot: r.Plot,
        production: r.Production,
        rating: r.Rated,
        title: r.Title,
        year: r.Year,
        imdbRating: r.imdbRating
      }

      dispatch(setSelectedTab('movie'))
      dispatch(receiveMovies(movie))
    })
    .catch(e => dispatch(fetchMoviesFail(title, e)))
  }
}
