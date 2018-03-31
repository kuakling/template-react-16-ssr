import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Helmet } from "react-helmet";
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { Provider } from 'react-redux';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import 'isomorphic-fetch';

import config from '../shared/core/config';
import configureStore from '../shared/core/configure-store';
import App from '../shared/App';

/**
 * Provides the server side rendered app. In development environment, this method is called by
 * `react-hot-server-middleware`.
 *
 * This method renders the ejs template `public/views/index.ejs`.
 *
 * @param clientStats Parameter passed by hot server middleware
 */
export default ({ clientStats }) => async (req, res) => {
  const context = {};

  const preloadedState = {
    todos: [{
      id: 1,
      name: 'Walk the dog'
    }, {
      id: 2,
      name: 'Buy butter from the store'
    }]
  };

  
  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
    res.status(200);
    res.render('index', ejsParams);
    res.end();
  });

  const cache = new InMemoryCache();
  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = req.cookies[config.auth.storageName]
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : undefined,
      } 
    }));
  
    return forward(operation);
  });
  const httpLink = createHttpLink({
    uri: config.apollo.uri,
    credentials: 'same-origin',
  });

  const link = ApolloLink.from([
    errorLink,
    authMiddleware,
    httpLink,
  ]);

  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link,
    cache,
  });

  const store = configureStore(preloadedState);
  const routerProps = {
    location: req.url,
    context,
    basename: process.env.REACT_APP_BASE_URL ? `/${process.env.REACT_APP_BASE_URL}` : undefined
  }

  const app = (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <StaticRouter {...routerProps}>
          <App />
        </StaticRouter>
      </Provider>
    </ApolloProvider>
  );

  const appString = ReactDOM.renderToStaticMarkup(app);
  const chunkNames = flushChunkNames();
  const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });
  const helmet = Helmet.renderStatic();
  const ejsParams = {
    appString,
    js,
    styles,
    cssHash,
    helmet,
    preloadedState: JSON.stringify({ ...preloadedState }),
    apolloState: JSON.stringify({})
  };


  /*
   * See https://reacttraining.com/react-router/web/guides/server-rendering for details
   * on this configuration.
   */
  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
    res.end();
  } else {
    renderToStringWithData(app).then((content) => {
      res.status(200);
      ejsParams.appString = content;
      // ejsParams.preloadedState = JSON.stringify({ ...preloadedState })
      ejsParams.apolloState = JSON.stringify(client.extract())
      if (process.env.NODE_ENV === 'development') {
        res.render('index', ejsParams);
      } else {
        res.render('index', ejsParams, function(err, html) {
          if(err) res.send(err);
          const minify = require('html-minifier').minify;
          res.send(minify(html, {
            // removeAttributeQuotes: true,
            collapseWhitespace: true
          }))
        });
      }
      res.end();
    });
  }
};
