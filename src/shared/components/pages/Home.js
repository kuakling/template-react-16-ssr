import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet";
import config from '../../core/config';


export default class Home extends Component {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>My Title</title>
        </Helmet>
        <h1>Home Component.</h1>
      </Fragment>
    );
  }

}