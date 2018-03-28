import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { graphql } from 'react-apollo';
import sessionQuery from '../../../gql/queries/session.gql';

import Home from './Home';
import Profile from './Profile';

export const TO_PREFIX = '/user';

@graphql(sessionQuery)
export default class AuthIndex extends Component {
  render() {
    const { loading, session } = this.props.data;
    if (loading) return (<div>Loading...</div>);
    if (!session.ok) return (<div>403 Forbidden</div>)
    return (
      <Switch>
        <Route exact path={`${TO_PREFIX}`} component={Home} />
        <Route exact path={`${TO_PREFIX}/profile`} component={Profile} />
      </Switch>
    )
  }
}
