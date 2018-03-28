// Schema for sample GraphQL server.

// ----------------------
// IMPORTS

// GraphQL schema library, for building our GraphQL schema
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
} from 'graphql';

import * as schemas from './schemas/index';

// ----------------------

// Root query.  This is our 'public API'.
const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields() {
    return {
      message         : schemas.message.query,
      user            : schemas.user.query,
      session         : schemas.session.query,
    };
  },
});


// Mutations.  These are our 'HTTP POST'-style API functions, that modify
// data in some way
const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to create or modify stuff',
  fields() {
    return {
      signup                      : schemas.user.signUpMutation,
      signupConfirm               : schemas.user.signUpConfirmMutation,
      userProfileUpdate           : schemas.userProfile.updateMutation,
      userProfileChangeAvatar     : schemas.userProfile.changeAvatarMutation,
      userProfileDeleteAvatar     : schemas.userProfile.deleteAvatarMutation,
      userProfileChangeCover      : schemas.userProfile.changeCoverMutation,
      userProfileDeleteCover      : schemas.userProfile.deleteCoverMutation,
      login                       : schemas.session.loginMutation,
      logout                      : schemas.session.logoutMutation,
    };
  },
});

// The resulting schema.  We insert our 'root' `Query` object, to tell our
// GraphQL server what to respond to.  We could also add a root `mutation`
// if we want to pass mutation queries that have side-effects (e.g. like HTTP POST)
export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
