import { connect } from 'react-redux'
import MoviesList from '../components/MoviesList.jsx'

const mapStateToProps = (state) => {
  return {movies: state.movies}
}

const VisibleList = connect(
  mapStateToProps
  )(MoviesList)

export default VisibleList
