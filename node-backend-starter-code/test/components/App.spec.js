/* globals describe, it */

import App from '../../js/components/App.jsx'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import React from 'react'

describe('<App />', () => {
  it('renders ', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('.container')).to.have.length(1)
  })
})
