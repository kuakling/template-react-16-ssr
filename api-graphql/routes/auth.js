import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config';
import {
  encodeJWT,
  decodeJWT
} from '../utils/hash';

const router = express.Router();
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new GoogleStrategy({
  clientID: config.auth.oAuth.google.clientID,
  clientSecret: config.auth.oAuth.google.clientSecret,
  callbackURL: "http://localhost/auth/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    // console.log(profile);
    return done(null, profile);
  }
));

router.get('/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email'
    ]
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    // successRedirect: '/',
    failureRedirect: '/auth/google/failure'
  }),
  function (req, res, next) {
    const userData = {
      googleId: req.user.id
    };
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const jwtValue = encodeJWT(userData);
    res.cookie(config.auth.storageName, jwtValue, expiresAt);
    // console.log(jwtValue);
    res.redirect('/');
  }
);



router.get('/google/failure', (req, res, next) => {
  res.send('Login error');
});

router.get('/logged', (req, res) => {
  res.send(JSON.stringify(decodeJWT(req.cookies[config.auth.storageName])));
});

router.get('/xx', (req, res) => {
  res.send(JSON.stringify(req.cookies));
});

// module.exports = router;
export const auth = router;
