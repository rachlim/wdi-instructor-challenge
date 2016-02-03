import React from 'react'
import { connect } from 'react-redux'
import { fetchMovie } from '../actions'

const mapStateToProps = (state, {params}) => {
  return {
    movie: state.movie[params.id]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    fetchMovie
  }
}

class MovieDetail extends React.Component {
  componentWillMount () {
    let {params, fetchMovie, dispatch} = this.props
    dispatch(fetchMovie(params.id))
  }

  render () {
    let {movie} = this.props

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
          <div> Heartthis! </div>
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
