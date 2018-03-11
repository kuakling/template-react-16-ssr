import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from "react-helmet";

import './style.global.styl';

import Home from './components/Home';
import About from './components/About';
import Todos from './components/Todos';
import Message from './components/Message';
import NotFound from './components/NotFound';

import Nav from './components/blocks/Nav';

/**
 * The `App` component is the entry point for the react app.
 * It is rendered on the client as well as on the server.
 *
 * You can start developing your react app here.
 */
export default class App extends Component {

  render() {
    return (
      <div>
        <Helmet
          titleTemplate="%s | React 16 SSR "
          defaultTitle="My Default Title"
        />
        
        <Nav />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/todos' component={Todos} />
          <Route path='/message' component={Message} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }

}
