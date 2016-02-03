import '../scss/styles.scss'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import store, { history } from './store'
import App from './components/App.jsx'
import Search from './components/Search.jsx'
import MovieDetail from './components/MovieDetail.jsx'

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Search}/>
        <Route path='/movie/:id' component={MovieDetail} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
