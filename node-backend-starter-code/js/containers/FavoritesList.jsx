import React, { Component } from 'react'
import { connect } from 'react-redux'
import MoviesList from '../components/MoviesList.jsx'
import { fetchFavorites } from '../actions'

const mapStateToProps = (state) => {
  return {
    movies: state.favorites,
    isFavorite: true
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFavorites
  }
}

class FavoriteList extends Component {
  componentWillMount () {
    console.log(this.props.fetchFavorites);
  }
  render () {
    return (
      <MoviesList {...this.props} />
    )
  }
}

export default connect(
  mapStateToProps,
  {fetchFavorites}
)(FavoriteList)
