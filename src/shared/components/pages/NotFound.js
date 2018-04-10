import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './notFound.styl';

export default class NotFound extends Component {
  render() {
    return (
      <div className={style.wrap}>
        <section>
          <div className={style.status404}>404</div>
          <div>Page Not Found :(</div>
          <Link to='/'>Back Home</Link>
        </section>
      </div>
    );
  }

}