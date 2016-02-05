/* global describe, it, afterEach */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../js/actions'
import nock from 'nock'

const mockStore = configureMockStore([thunk])

describe('fetchMovie', () => {
  let movie = {
    id: 'tt0076759'
  }

  afterEach(function () {
    nock.cleanAll()
  })

  it('should handle RECEIVE_MOVIE', function (done) {
    nock('http://localhost:3000')
      .post('/api/favorites')
      .reply(200, {ok: true})

    const expectedActions = [
      {type: 'ADD_FAVORITE_REQUEST', movie},
      {type: 'ADD_FAVORITE', movie}
    ]
    const store = mockStore({}, expectedActions, done)
    store.dispatch(actions.saveFavorite(movie))
  })
})
