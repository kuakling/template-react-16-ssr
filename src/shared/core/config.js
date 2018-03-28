export default {
  auth: {
    storageName: 'appJWT'
  },
  jwt: {
    secretKey: 'MY_SCRECRET'
  },
  apollo: {
    // uri: process.env.REACT_APP_APOLLO_URI
    uri: 'http://localhost:3001/graphql'
  }
}