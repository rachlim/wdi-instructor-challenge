import React, {Component} from 'react'

export default class Chatbox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      movies: []
    }
  }

  submitHandler (e) {
    e.preventDefault()
    fetch(`http://www.omdbapi.com/?s=${this.state.search}&type=movie`)
      .then(r => r.json())
      .then(res => this.setState({movies: res.Search}))
  }

  handleChange (e) {
    this.setState({'search': e.target.value})
  }

  render () {
    return (
      <div>
        <form onSubmit={::this.submitHandler}>
          <input type='search' value={this.state.search} onChange={::this.handleChange} />
          <button type='submit'>Search</button>
        </form>
        <MovieList movies={this.state.movies} />
      </div>
    )
  }
}

class MovieList extends Component {
  render () {
    let movies = this.props.movies
    return (
      <div>
        {movies.map(m => {
          return (
            <div key={m.imdbID}>
              {/* TODO: Change to Movies Component Page */}
              <h3><a href='#'>{m.Title}</a></h3>
              }
            </div>
          )
        })}
      </div>
    )
  }
}

class MovieDetail extends Component {

}