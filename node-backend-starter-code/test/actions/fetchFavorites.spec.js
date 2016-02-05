/* global describe, it, beforeEach, afterEach, sinon */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../js/actions'

const mockStore = configureMockStore([thunk])

describe('fetchMovie', () => {
  let movie = {
    id: 'tt0076759'
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
      json: () => Promise.resolve(movie)
    }))

    const expectedActions = [
      {type: 'ADD_FAVORITE_REQUEST', movie},
      {type: 'ADD_FAVORITE', movie}
    ]
    const store = mockStore({}, expectedActions, done)
    store.dispatch(actions.saveFavorite(movie))
  })
})
