import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import config from '../core/config';
// import SocialButton from './blocks/SocialButton';

import {
  getCookie
} from '../core/helpers'


const handleSocialLogin = (user) => {
  console.log('Google user = ', user)
}

const handleSocialLoginFailure = (err) => {
  console.error(err)
}

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
        { /*<SocialButton
          provider='google'
          appId='869126235348-f4unombicdm90a6kudi4ksirvibapgjq.apps.googleusercontent.com'
          onLoginSuccess={handleSocialLogin}
          onLoginFailure={handleSocialLoginFailure}
        >
          Login with Google
        </SocialButton> */ }
      </div>
    );
  }

}