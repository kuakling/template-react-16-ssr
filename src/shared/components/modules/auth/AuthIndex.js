import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Confirm from './Confirm';

import style from './authIndex.styl';

export const TO_PREFIX = '/auth';

export default class AuthIndex extends Component {
  render() {
    return (
      <div className={style.container}>
        <Switch>
          <Route exact path={`${TO_PREFIX}`} component={Home} />
          <Route path={`${TO_PREFIX}/login`} component={Login} />
          <Route path={`${TO_PREFIX}/logout`} component={Logout} />
          <Route path={`${TO_PREFIX}/confirm/:token`} component={Confirm} />
        </Switch>
      </div>
    )
  }
}
