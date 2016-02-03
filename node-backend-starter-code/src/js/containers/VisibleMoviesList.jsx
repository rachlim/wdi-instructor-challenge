import { connect } from 'react-redux'
import MoviesList from '../components/MoviesList.jsx'
import { fetchMovie } from '../actions'

const mapStateToProps = (state) => {
  return {movies: state.movies}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onMovieClick: (e, id, title) => {
      dispatch(fetchMovie(id, title))
    }
  }
}

const VisibleList = connect(
  mapStateToProps,
  mapDispatchToProps
  )(MoviesList)

export default VisibleList
