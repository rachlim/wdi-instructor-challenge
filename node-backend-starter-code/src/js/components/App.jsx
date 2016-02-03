import React, {Component} from 'react'
import { Link } from 'react-router'

export default class App extends Component {
  render () {
    return (
      <div>
        <nav>
          <Link to='/'>Search &nbsp;</Link>
          <Link to='/favorites'>Favorites</Link>
        </nav>
        {this.props.children}
      </div>
    )
  }
}
