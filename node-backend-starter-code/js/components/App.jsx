import React, {Component} from 'react'
import { Link } from 'react-router'

class App extends Component {
  render () {
    return (
      <div>
        <nav>
          <Link to='/'>Search </Link>
          <Link to='/favorites'>Favorites</Link>
        </nav>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default App

