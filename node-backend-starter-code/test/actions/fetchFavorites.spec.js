/* global describe, it, afterEach */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../js/actions'
import fetchMock from 'fetch-mock'

const mockStore = configureMockStore([thunk])

describe('fetchMovie', () => {
  let movie = {
    id: 'tt0076759'
  }

  afterEach(function () {
    fetchMock.restore()
  })

  it('should handle ADD_FAVORITE', function (done) {
    fetchMock.mock('/api/favorites', 'post', {ok: true})

    const expectedActions = [
      {type: 'ADD_FAVORITE_REQUEST', movie},
      {type: 'ADD_FAVORITE', movie}
    ]

    const store = mockStore({}, expectedActions, done)
    store.dispatch(actions.saveFavorite(movie))
  })
})
