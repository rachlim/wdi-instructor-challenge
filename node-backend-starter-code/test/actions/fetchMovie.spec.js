/* global describe, it, beforeEach, afterEach, sinon */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../js/actions'

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

  beforeEach(function () {
    this.stub = sinon.stub(window, 'fetch')
  })

  afterEach(function () {
    this.stub.restore()
  })

  it('should handle RECEIVE_MOVIE', function (done) {
    this.stub.returns(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
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
    }))

    const expectedActions = [
      {type: 'REQUEST_MOVIE', id: movie.id},
      {type: 'RECEIVE_MOVIE', movie}
    ]
    const store = mockStore({}, expectedActions, done)
    store.dispatch(actions.fetchMovie(movie.id))
  })
})
