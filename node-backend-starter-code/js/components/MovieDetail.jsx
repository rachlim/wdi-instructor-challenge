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
        <div className='movieDetail'>

          <figure>
            <img src={movie.poster} />
          </figure>

          <div className='movieDetail__content'>
            <h1>{movie.title}</h1>
            <div className='movieDetail__meta'>
              <span className='movieDetail__meta-item'>Filmmed in {movie.year}</span>
              <span className='movieDetail__meta-item'>{movie.rating}</span>
              <div className='movieDetail__heart' onClick={::this.clickHandler}>
                <svg className={favorite ? 'is-favorite' : ''} viewBox='0 0 1024 1024'>
                  <path class='path1' d='M880.077 212.531c-85.606-78.592-224.41-78.592-310.016 0l-58.061 53.35-58.112-53.35c-85.606-78.592-224.358-78.592-309.965 0-96.307 88.371-96.307 231.629 0 320.051l368.077 337.818 368.077-337.818c96.307-88.422 96.307-231.68 0-320.051z'></path>
                </svg>
              </div>
            </div>
            <p>{movie.plot}</p>
            <hr/>
            <p><strong>Actors</strong>: {movie.actors}</p>
            <p><strong>Director</strong>: {movie.director}</p>
            <p><strong>IMDB Rating</strong>: {movie.imdbRating}</p>
          </div>
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
