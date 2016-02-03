import '../scss/styles.scss'

import React, {Component} from 'react'
import {render} from 'react-dom'
import SearchMovies from './components/SearchMovies.jsx'
import {Router, Route, Link} from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
const history = createBrowserHistory()

class App extends Component {
  render () {
    return (
      <div>
        <SearchMovies />
        <Link to='/about'>About Page</Link>
      </div>)
  }
}

class About extends Component {
  render() {
    return (<div>About</div>)
  }
}

render((
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='/about' component={About}/>
    </Route>
  </Router>
), document.getElementById('app'))

// Test for hot-reload
if (module.hot) {
  module.hot.accept()
}
