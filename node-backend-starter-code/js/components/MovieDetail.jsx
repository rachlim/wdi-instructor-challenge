import React from 'react'
import { connect } from 'react-redux'
import { fetchMovie, saveFavorite, deleteFavorite } from '../actions'

const mapStateToProps = ({favorites, movie}, {params}) => {
  let favorite = favorites.movies.find(f => {
    return f.id === params.id
  })

  return {
    movie: movie[params.id],
    favorite: favorite
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    fetchMovie,
    deleteFavorite,
    saveFavorite
  }
}

class MovieDetail extends React.Component {
  componentWillMount () {
    let {params, fetchMovie, dispatch} = this.props
    dispatch(fetchMovie(params.id))
  }

  clickHandler (e) {
    let {
      movie,
      params,
      deleteFavorite,
      dispatch,
      favorite
    } = this.props

    if (favorite) {
      dispatch(deleteFavorite(favorite))
    } else {
      dispatch(saveFavorite(movie))
    }
  }

  render () {
    let {dispatch, movie, favorite} = this.props

    if (movie) {
      return (
        <div>
          <h1>{movie.title}</h1>
          <img src={movie.poster} />
          <p>actors: {movie.actors}</p>
          <p>director: {movie.director}</p>
          <p>imdbRating: {movie.imdbRating}</p>
          <p>plot: {movie.plot}</p>
          <p>production: {movie.production}</p>
          <p>rating: {movie.rating}</p>
          <p>year: {movie.year}</p>
          <div style={{
      color: favorite ? 'red' : 'inherit'
    }} onClick={::this.clickHandler}> Heartthis! </div>
        </div>
      )
    } else {
      return (<div> Fetching Movie </div>)
    }
  }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovieDetail)
