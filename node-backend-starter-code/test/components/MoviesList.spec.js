/* globals it */
import MoviesList from '../../js/components/MoviesList.jsx'
import { mount, describeWithDOM } from 'enzyme'
import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'

describeWithDOM('<MoviesList />', () => {
  it('renders .movieList if has props.movies', () => {
    let movies = [[1], [2]]
    const onMovieClick = sinon.spy()
    const wrapper = mount(<MoviesList movies={movies} onMovieClick={onMovieClick}/>)

    expect(wrapper.find('.movieList')).to.have.length(1)
  })

  it('renders only a div if no props.movies', () => {
    let movies = []
    const onMovieClick = sinon.spy()
    const wrapper = mount(<MoviesList movies={movies} onMovieClick={onMovieClick}/>)

    expect(wrapper.find('div')).to.have.length(1)
  })

  // NOTE: Don't need to test clicking on Link in react-router because they have already tested it
})
