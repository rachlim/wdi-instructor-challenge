import React from 'react'
import { connect } from 'react-redux'
import { fetchMovie, addFavorite, removeFavorite } from '../actions'

const mapStateToProps = (state, {params}) => {
  let index = state.favorite.indexOf(params.id)
  return {
    movie: state.movie[params.id],
    favorite: index > -1 ? index : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    fetchMovie,
    removeFavorite,
    addFavorite
  }
}

class MovieDetail extends React.Component {
  componentWillMount () {
    let {params, fetchMovie, dispatch} = this.props
    dispatch(fetchMovie(params.id))
  }

  clickHandler (e) {
    let {
      params,
      removeFavorite,
      dispatch,
      favorite
    } = this.props

    if (favorite !== null) {
      dispatch(removeFavorite(favorite))
    } else {
      dispatch(addFavorite(params.id))
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
      color: favorite === null ? 'red' : 'inherit'
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
