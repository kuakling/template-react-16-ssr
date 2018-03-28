import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import config from '../core/config';
// import SocialButton from './blocks/SocialButton';

import {
  getCookie
} from '../core/helpers'



export default class Home extends Component {
  render() {
    // if(!SERVER) console.log('qqqqqqq', document.cookie);
    // if (!SERVER) console.log(getCookie(config.auth.storageName) || 'No.....');
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