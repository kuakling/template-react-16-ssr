require('dotenv').config();

const REACT_APP = /^REACT_APP_/i;

export default () => {
  var processEnv = Object
    .keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce((env, key) => {
      env[key] = JSON.stringify(process.env[key]);
      return env;
    }, {
      'NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    });
  return {'process.env': processEnv};
}