import React from 'react'
// import { connect } from 'react-redux'

class MovieDetail extends React.Component {
  render() {
    console.log(this.props)
    return (<div>Movie!</div>)
  }
}

// const MovieDetail = (state, props) => {
//   let id = state.params.id

//   return (
//     <div> {id} </div>
//   )
// }

export default MovieDetail
