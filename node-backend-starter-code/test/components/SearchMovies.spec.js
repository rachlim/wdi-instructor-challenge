/* globals it */
import SearchMovies from '../../js/containers/SearchMovies.jsx'
import { mount, describeWithDOM } from 'enzyme'
import { expect } from 'chai'
import { Provider } from 'react-redux'
import store from '../store'
import React from 'react'

describeWithDOM('<SearchMovies />', () => {
  it('should render a form', function () {
    const wrapper = mount(
      <Provider store={store}>
        <SearchMovies />
      </Provider>
    )
    expect(wrapper.find('form')).to.have.length(1)
  })
})
