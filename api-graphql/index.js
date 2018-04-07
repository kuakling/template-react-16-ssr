/**
 *  Copyright (c) 2015-present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { graphqlExpress } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';

import config from './config';
import schema from './data/schema';
import * as routes from './routes/index';

const PORT = 3001

require('./data/db/index');
const app = express()

app.use(cors({ 
  origin: '*',
  credentials: true 
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(`/auth`, routes.auth);

app.use('/graphql', graphqlExpress((req, res) => {
  // console.log(req.cookies)
  const authHeader = req.headers.authorization || req.cookies[config.auth.storageName];
  
  return {
    schema,
    context: {
      req,
      res,
      state: {
        jwt: authHeader ? authHeader.replace(/^bearer\s*/i, '') : undefined
      }
    }
  }
}));
app.get('/playground', expressPlayground({
  endpoint: '/graphql',
  credentials: 'include'
}))

app.listen(PORT)

console.log(
  `Serving the GraphQL Playground on http://localhost:${PORT}/playground`,
)