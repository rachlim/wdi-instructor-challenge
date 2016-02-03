import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

const mapStateToProps = (state) => {
  return {
    state
  }
}

class App extends Component {
  constructor () {
    super()
  }

  componentWillMount() {
    console.log(this.props.state)
  }

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

export default connect(mapStateToProps)(App)

