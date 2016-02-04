import React, { Component } from 'react'
import { connect } from 'react-redux'
import MoviesList from '../components/MoviesList.jsx'
import { fetchFavorites } from '../actions'

const mapStateToProps = ({favorites}) => {
  return {
    fetched: favorites.fetched,
    movies: favorites.movies,
    isFavorite: true
  }
}

class FavoriteList extends Component {
  componentWillMount () {
    if (!this.props.fetched) {
      this.props.fetchFavorites()
    }
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
