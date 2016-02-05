/* global describe, it */

import { expect } from 'chai'
import * as actions from '../../js/actions'

describe('Pure actions', () => {
  it('should have a type', () => {
    for (let method in actions) {
      if (typeof actions[method] === 'object') {
        expect(actions[method]()).to.have.keys('type')
      }
    }
  })
})
