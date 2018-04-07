import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import config from '../../../../shared/core/config';
import { notification } from 'antd';
import sessionQuery from '../../../gql/queries/session.gql';
import logoutMutation from '../../../gql/mutations/auth/logout.gql';

import {
  deleteCookie
} from '../../../core/helpers'

@withApollo
@graphql(logoutMutation)
@graphql(sessionQuery)
export default class Logout extends Component {
  constructor(props) {
    super(props);

    this.logout();
  }

  logout = async () => {
    try {
      const { data: { logout } } = await this.props.mutate();
      if(logout.ok){
        if (!SERVER) {
          window.localStorage.removeItem(config.auth.storageName);
          deleteCookie(config.auth.storageName)
        }
        this.props.client.resetStore();
        notification.success({
          message: 'Logout Success',
          description: 'Current user is Guest',
        });
        this.props.history.push('/');
        return;
      } else {
        throw new Error(logout.message || 'Logout fail');
      }
    } catch (err) {
      notification.error({
        message: 'Login Fail!!',
        description: err.message,
      });
      console.error('GraphQL error: ', err.message);
    }
  }

  tryLogout = async (e) => {
    if(e) e.preventDefault();
    try {
      const { data: { logout } } = await this.props.mutate();
      if(logout.ok){
        if (!SERVER) {
          window.localStorage.removeItem(config.auth.storageName);
          deleteCookie(config.auth.storageName)
        }
        // this.props.client.resetStore();
        // this.props.history.push('/');
        return;
      } else {
        throw new Error(logout.message || 'Logout fail');
      }
    } catch (err) {
      console.error('GraphQL error: ', err.message);
    }
  }
  render() {
    return (
      <div>
        Logout
      </div>
    )
  }
}
