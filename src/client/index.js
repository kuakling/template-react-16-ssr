import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';

import App from '../shared/App';
import configureStore from '../shared/core/configure-store';

const store = configureStore(window.__PRELOADED_STATE__);

const httpLink = createHttpLink({ uri: process.env.REACT_APP_APOLLO_URI });
const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    if (headers) {
      const token = headers.get("token");

      if (token) {
        localStorage.setItem("token", token);
      }

    }

    configureStore({ apollo: response.data })
    return response;
  });
});

// use with apollo-client
const link = afterwareLink.concat(httpLink);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.__PRELOADED_STATE__.apollo)
});

delete window.__PRELOADED_STATE__;

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
  hydrate(
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
