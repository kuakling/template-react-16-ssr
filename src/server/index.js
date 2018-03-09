import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Helmet } from "react-helmet";
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { Provider } from 'react-redux';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import 'isomorphic-fetch';

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

  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri: process.env.REACT_APP_APOLLO_URI,
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
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

  const appString = ReactDOM.renderToString(app);
  const chunkNames = flushChunkNames();
  const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });
  const helmet = Helmet.renderStatic();


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
      const initialState = client.extract();
      const params = {
        appString: content,
        js,
        styles,
        cssHash,
        helmet,
        preloadedState: JSON.stringify({ ...preloadedState, 'apollo': initialState })
      };
      res.status(200);
      if (process.env.NODE_ENV === 'development') {
        res.render('index', params);
      } else {
        res.render('index', params, function(err, html) {
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
