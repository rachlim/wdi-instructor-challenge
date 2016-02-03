import React, {Component} from 'react'
import SearchMovies from '../containers/SearchMovies.jsx'
import VisibleMoviesList from '../containers/VisibleMoviesList.jsx'

export default class App extends Component {
  render () {
    return (
      <div>
        <SearchMovies />
        <VisibleMoviesList />
      </div>
      )
  }
}
