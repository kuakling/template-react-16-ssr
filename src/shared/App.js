import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from "react-helmet";
import nprogress from 'nprogress';

import './style.global.styl';

import Pages, { pageReg } from './components/pages';
import NotFound from './components/pages/NotFound';
import AuthIndex from './components/modules/auth/AuthIndex';
import UserIndex from './components/modules/user/UserIndex';

/**
 * The `App` component is the entry point for the react app.
 * It is rendered on the client as well as on the server.
 *
 * You can start developing your react app here.
 */
export default class App extends Component {

  render() {
    // console.log(pageReg)
    return (
      <Fragment>
        <Helmet
          titleTemplate="%s | React 16 SSR "
          defaultTitle="My Default Title"
        />
        <Switch>
          <Route path='/auth' component={AuthIndex} />
          <Route path='/user' component={UserIndex} />
          <Route path={`(${pageReg})`} render={(props) => (<Pages />)} />
          <Route component={NotFound} />
        </Switch>
      </Fragment>
    )
  }

  componentWillUpdate = (nextProps, nextState) => {
    nprogress.start()
  }

  componentDidUpdate = (prevProps, prevState) => {
    nprogress.done()
  }
  
  componentDidMount = () => {
    const ele = document.getElementById('loading-indicator')
      if(ele){
        // fade out
        ele.classList.add('available')
        setTimeout(() => {
          // remove from DOM
          ele.outerHTML = ''
        }, 1000)
      }
  }
  
}
