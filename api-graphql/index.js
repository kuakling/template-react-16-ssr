// /**
//  *  Copyright (c) 2015-present, Facebook, Inc.
//  *  All rights reserved.
//  *
//  *  This source code is licensed under the BSD-style license found in the
//  *  LICENSE file in the root directory of this source tree. An additional grant
//  *  of patent rights can be found in the PATENTS file in the same directory.
//  */

// import express from 'express';
// import graphqlHTTP from 'express-graphql';
// import { buildSchema } from 'graphql';
// import expressPlayground from 'graphql-playground-middleware-express';
// // import bodyParser from 'body-parser';
// import schema from './data/schema';

// // Construct a schema, using GraphQL schema language
// // const schema = buildSchema(`
// //   type Query {
// //     hello: String
// //   }
// // `);

// // The root provides a resolver function for each API endpoint
// const root = {
//   hello: () => 'Hello world!123',
// };

// const app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   // graphiql: true,
// }));
// app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
// app.listen(4000);
// console.log('Running a GraphQL API server at http://localhost:4000/playground');


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