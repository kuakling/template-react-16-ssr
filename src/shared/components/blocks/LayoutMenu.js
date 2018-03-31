import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import sessionQuery from '../../gql/queries/session.gql';
import { Menu, Icon } from 'antd';

const guestLinks = [
  { to: '/auth/login', title: 'Login', icon: 'login' },
  { to: '/signup', title: 'Signup', icon: 'user-add' },
];

const userLink = [
  { to: '/user/profile', title: 'Profile', icon: 'profile' },
  { to: '/auth/logout', title: 'Logout', icon: 'logout' },
];

const genLinks = type => ([
  { to: '/', title: 'Home', icon: 'home' },
  { to: '/about', title: 'About', icon: 'info-circle-o' },
  { to: '/todos', title: 'Todos (Redux)' },
  { to: '/message', title: 'Message (Graphql)', icon: 'database' },
  ...(type === 0 ? guestLinks : userLink),
  { to: '/random-link', title: 'Not Found', icon: 'frown-o' },
]);

@graphql(sessionQuery)
export default class LayoutMenu extends Component {
  render() {
    const { loading, session } = this.props.data;
    if (loading) return (<div>Loading...</div>);
    const links = genLinks(session.ok ? 1 : 0);
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        {links.map((item, index) => (
          <Menu.Item key={item.to}>
            <Link to={item.to}>
              {item.icon ? <Icon type={item.icon} /> : ''}
              <span className="nav-text">{item.title}</span>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    )
  }
}
