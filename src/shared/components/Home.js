import React, { Component } from 'react';
import { Helmet } from "react-helmet";

export default class Home extends Component {  
  render() {
    return (
      <div>
        <Helmet>
          <title>My Title</title>
        </Helmet>
        <h1>Home Component.</h1>
      </div>
    );
  }

}