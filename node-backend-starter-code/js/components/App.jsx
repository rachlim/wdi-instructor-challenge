import React, {Component} from 'react'
import { Link } from 'react-router'

class App extends Component {
  render () {
    return (
      <div>
        <nav>
          <Link to='/'>Search  </Link>
          <Link to='/favorites'>Favorites</Link>
        </nav>
        {this.props.children}
      </div>
    )
  }
}

export default App

