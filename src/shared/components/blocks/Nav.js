import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import css from './nav.styl';

export default class Nav extends Component {
  render() {
    return (
      <nav className={css.nav}>
        <div className={css.nav_left}>Welcome to React Fiber.</div>
        <ul className={css.nav_right}>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/todos'>Todos (Redux)</Link>
          </li>
          <li>
            <Link to='/message'>Message (Graphql)</Link>
          </li>
          <li>
            <Link to='/random-link'>Not Found</Link>
          </li>
        </ul>
      </nav>
    );
  }

}