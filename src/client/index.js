import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
// import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';

import config from '../shared/core/config';
import App from '../shared/App';
import configureStore from '../shared/core/configure-store';
import { getCookie } from '../shared/core/helpers';

const store = configureStore(window.__PRELOADED_STATE__);
const cache = new InMemoryCache().restore(window.__APOLLO_STATE__)

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem(config.auth.storageName) || getCookie(config.auth.storageName)
  const enhanceHeaders = {
    authorization: `Bearer ${token}`
  }
  if (!token) {
    delete enhanceHeaders.authorization
  }
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...enhanceHeaders,
    }
  }));

  return forward(operation);
});
// const token = localStorage.getItem(config.auth.storageName) || getCookie(config.auth.storageName);
const httpLink = createHttpLink({
  uri: config.apollo.uri,
  credentials: 'same-origin',
  // headers: {
  //   Authorization: token ? `Bearer ${token}` : undefined
  // },
});

// use with apollo-client
const link = ApolloLink.from([
  authMiddleware,
  httpLink,
]);

const client = new ApolloClient({
  ssrMode: false,
  link,
  cache,
});

delete window.__PRELOADED_STATE__;
delete window.__APOLLO_STATE__;

/**
 * Renders a react component into the #react-root div container.
 * Since react 16, the `hydrate` method is used instead of `render` when dealing
 * with server side rendering.
 *
 * @param Component React component that should be rendered
 */

const routerProps = {
  basename: process.env.REACT_APP_BASE_URL ? `/${process.env.REACT_APP_BASE_URL}` : undefined
}
const render = Component => {
  ReactDOM.hydrate(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router {...routerProps}>
          <Component />
        </Router>
      </Provider>
    </ApolloProvider>,
    document.getElementById('react-root')
  );
};

render(App);

/**
 * This script provides hot module reloading in development mode.
 */
if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('../shared/App', () => {
    const App = require('../shared/App').default;
    render(App);
  });
}
