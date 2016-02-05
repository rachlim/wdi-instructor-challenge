/* global describe, it */
import { expect } from 'chai'
import { favorites, favorite } from '../../js/reducers'

describe('Favorites reducer', () => {
  it('should return initial state', () => {
    expect(favorites(undefined, {})).to.eql({})
  })

  it('should handle RECEIVE_FAVORITES', () => {
    expect(favorites({
      fetched: false,
      movies: []
    }, {
      type: 'RECEIVE_FAVORITES',
      movies: [{id: 1}, {id: 2}, {id: 3}]
    })).to.eql({
      fetched: true,
      movies: [{id: 1}, {id: 2}, {id: 3}]
    })
  })
})

describe('Favorite reducer', () => {
  it('should return initial state', () => {
    expect(favorite(undefined, {})).to.eql([])
  })

  it('should handle ADD_FAVORITE', () => {
    expect(favorite([], {
      type: 'ADD_FAVORITE',
      movie: {id: 1}
    })).to.eql([{id: 1}])
  })

  it('should handle REMOVE_FAVORITE', () => {
    let state = [
      {id: 1},
      {id: 2},
      {id: 3}
    ]

    let result = [
      {id: 1},
      {id: 3}
    ]

    expect(favorite(state, {
      type: 'REMOVE_FAVORITE',
      movie: {id: 2}
    })).to.eql(result)
  })
})
