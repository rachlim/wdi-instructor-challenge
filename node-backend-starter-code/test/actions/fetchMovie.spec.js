/* global describe, it, afterEach */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../js/actions'
import fetchMock from 'fetch-mock'

const mockStore = configureMockStore([thunk])

describe('fetchMovie', () => {
  let movie = {
    id: 'tt0076759',
    title: 'Some title',
    actors: 'some string',
    director: 'some string',
    plot: 'some string',
    poster: 'some string',
    production: 'some string',
    rating: 'some string',
    year: 'some string',
    imdbRating: 'some string'
  }

  afterEach(function () {
    fetchMock.restore()
  })

  it('should handle RECEIVE_MOVIE', function (done) {
    fetchMock.mock('^http://www.omdbapi.com', {
      Response: 'True',
      Title: 'Some title',
      Actors: 'some string',
      Director: 'some string',
      Plot: 'some string',
      Poster: 'some string',
      Production: 'some string',
      Rated: 'some string',
      Year: 'some string',
      imdbRating: 'some string'
    })

    const expectedActions = [
      {type: 'REQUEST_MOVIE', id: movie.id},
      {type: 'RECEIVE_MOVIE', movie}
    ]

    const store = mockStore({}, expectedActions, done)
    store.dispatch(actions.fetchMovie(movie.id))
  })
})

// Example of stubbing fetch with Sinon. Requires you to be on the browser though

// this.stub = sinon.stub(window, 'fetch')
// this.stub.returns(Promise.resolve({
//   ok: true,
//   json: () => Promise.resolve({
//     Response: 'True',
//     Title: 'Some title',
//     Actors: 'some string',
//     Director: 'some string',
//     Plot: 'some string',
//     Poster: 'some string',
//     Production: 'some string',
//     Rated: 'some string',
//     Year: 'some string',
//     imdbRating: 'some string'
//   })
// }))
//