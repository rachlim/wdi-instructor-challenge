/* global describe, it */
import { expect } from 'chai'
import { movie } from '../../js/reducers'

describe('movie reducer', () => {
  it('should return initial state', () => {
    expect(movie(undefined, {})).to.eql({})
  })

  it('should handle RECEIVE_MOVIE', () => {
    let m = {
      id: '33333',
      title: 'random title'
    }

    expect(movie({}, {
      type: 'RECEIVE_MOVIE',
      movie: m
    })).to.eql({
      '33333': m
    })
  })
})
