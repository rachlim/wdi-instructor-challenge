import { connect } from 'react-redux'
import MoviesList from '../components/MoviesList.jsx'

const mapStateToProps = (state) => {
  return {movies: state.movies}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (id) => {
      dispatch(/* some action here */)
    }
  }
}

const VisibleList = connect(
  mapStateToProps,
  mapDispatchToProps
  )(MoviesList)

export default VisibleList
