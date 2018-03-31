import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import sessionQuery from '../../gql/queries/session.gql';
import PageTitle from './PageTitle';

import css from './nav.styl';

const guestLinks = [
  { to: '/auth/login', title: 'Login' },
  { to: '/signup', title: 'Signup' },
];

const userLink = [
  { to: '/user/profile', title: 'Profile' },
  { to: '/auth/logout', title: 'Logout' },
];

const genLinks = type => ([
  { to: '/', title: 'Home' },
  { to: '/about', title: 'About' },
  { to: '/todos', title: 'Todos (Redux)' },
  { to: '/message', title: 'Message (Graphql)' },
  ...(type === 0 ? guestLinks : userLink),
  { to: '/random-link', title: 'Not Found' },
]);

const LinkItem = (props) => (
  <Link {...props} className={props.className || "navbar-item"}>{props.title}</Link>
);

@graphql(sessionQuery)
export default class Nav extends Component {
  state = {
    isActiveNav: false
  }

  toggleNav = () => {
    this.setState({
      isActiveNav: !this.state.isActiveNav
    })
  }

  render() {
    const { error, loading, session } = this.props.data;
    if (loading) return (<div>Loading...</div>);
    if(error) {
      console.log(error)
      return (<div>55556</div>)
    }
    const links = genLinks(session.ok ? 1 : 0);
    return (
      <nav className="navbar is-primary">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item" style={{ fontWeight: 'bold' }}>
            <span>Universal React Fiber</span>
          </Link>
          <div className="navbar-burger burger" data-target="navMenu" onClick={this.toggleNav}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navMenu" className={`navbar-menu${this.state.isActiveNav ? ' is-active' : ''}`}>
          <div className="navbar-start">
            {links.map((item, index) => (
              <LinkItem {...item} key={`link-${index}`} />
            ))}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="field is-grouped">
                <p className="control">
                  <a className="button" href="https://github.com/kuakling/template-react-16-ssr" target="_blank">
                    <span>Github</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

}