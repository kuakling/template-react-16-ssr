// GraphQL schema library, for building our schema layouts
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';

import config from '../../config'
import { login, getSessionOnJWT } from '../db/models/Session';
import { FieldType } from './form';
import { user } from './user';

// ----------------------
const me = {}

// Session response object.  Use this whenever we're expecting a user, but there
// could also be an error
me.type = new GraphQLObjectType({
  name: 'Session',
  description: 'User session',
  fields() {
    return {
      ok: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve(obj) {
          return obj.ok;
        },
      },
      errors: {
        type: new GraphQLList(FieldType),
        resolve(obj) {
          return obj.errors;
        },
      },
      jwt: {
        type: GraphQLString,
        resolve(obj) {
          return obj.session && obj.session.jwt();
        },
      },
      user: {
        type: user.type,
        resolve(obj) {
          return obj.session && obj.session.getUser();
        },
      },
    };
  },
});


me.query = {
  type: me.type,
  async resolve(root, args, ctx) {
    try {
      const session = await getSessionOnJWT(ctx.state.jwt);
      // Return the session record from the DB
      return {
        ok: true,
        session,
      };
    } catch (e) {
      // console.log('เออเร่อ ', ctx)
      return {
        ok: false,
        errors: e,
      };
    }
  },
}




////// Mutations /////////
me.logoutType = new GraphQLObjectType({
  name: 'Logout',
  description: 'User logout',
  fields() {
    return {
      ok: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve(obj) {
          return obj.ok;
        },
      },
      expiresAt: {
        type: GraphQLString,
        resolve(obj) {
          return obj.expiresAt;
        },
      },
      message: {
        type: GraphQLString,
      }
    }
  }
})

// Login mutation
me.loginMutation = {
  type: me.type,
  args: {
    identity: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  async resolve(_, args, ctx) {
    console.log(ctx.req.cookies);
    try {
      const session = await login(args);

      // If getting the JWT didn't throw, then we know we have a valid
      // JWT -- store it on a cookie so that we can re-use it for future
      // requests to the server
      ctx.res.cookie(config.auth.storageName, session.jwt(), {
        expires: session.expiresAt,
      });

      // Return the session record from the DB
      return {
        ok: true,
        session,
      };
    } catch (e) {
      return {
        ok: false,
        errors: e,
      };
    }
  },
};


me.logoutMutation = {
  type: me.logoutType,
  args: {},
  async resolve(_, arg, ctx) {
    try {
      const date = new Date()
      ctx.res.cookie(config.auth.storageName, '', {
        expires: date,
      });
      return {
        ok: true,
        expiresAt: date.toUTCString(),
      };
    } catch (e) {
      return {
        ok: false,
        expiresAt: null,
        message: 'Cannot logout mutation'
      };
    }
  }
}


export const session = me