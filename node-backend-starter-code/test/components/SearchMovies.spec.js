/* globals it */
import React from 'react'
import SearchMovies from '../../js/containers/SearchMovies.jsx'
import sinon from 'sinon'
import store from '../store'
import { expect } from 'chai'
import { mount, describeWithDOM } from 'enzyme'
import { Provider } from 'react-redux'
import { Simulate } from 'react-addons-test-utils'

describeWithDOM('<SearchMovies />', () => {
  it('should render a form with one input and one button', function () {
    const wrapper = mount(
      <Provider store={store}>
        <SearchMovies />
      </Provider>
    )
    expect(wrapper.find('form')).to.have.length(1)
    expect(wrapper.find('input')).to.have.length(1)
    expect(wrapper.find('button')).to.have.length(1)
  })

  it('should onSubmit when form is submitted', () => {
    let onSubmit = sinon.spy()
    const wrapper = mount(
      <Provider store={store}>
        <SearchMovies onSubmit={onSubmit} />
      </Provider>
    )

    Simulate.submit(wrapper.find('form').node)
    wrapper.find('form').simulate('submit')

    console.log(onSubmit.calledCount)

    // expect(onSubmit.calledOnce).to.equal(true)
  })

  it('¯_(ツ)_/¯')
})
