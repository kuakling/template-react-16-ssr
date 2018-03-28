// ----------------------
// IMPORTS

// GraphQL schema library, for building our GraphQL schema
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql';
import { FieldType } from './form';
import parseErrors from '../../utils/parseErrors';

/******** import database nodel ***********/
import User from '../db/models/User';

/***** import graphql another Graphql Type ********/
import { userProfile } from './userProfile';

const me = {}

// Message type.  Imagine this like static type hinting on the 'message'
// object we're going to throw back to the user
me.type = new GraphQLObjectType({
  name: 'User',
  description: 'GraphQL server user',
  fields() {
    return {
      _id: {
        type: GraphQLID,
      },
      username: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      confirmed: {
        type: GraphQLBoolean,
      },
      confirmationToken: {
        type: GraphQLString,
      },
      status: {
        type: GraphQLInt
      },
      createdAt: {
        type: GraphQLString,
      },
      updatedAt: {
        type: GraphQLString,
      },
      profile: {
        type: userProfile.type,
        async resolve(obj) {
          const result = await obj.getProfile();
          if(!result) return {};
          return result;
        }
      }
    };
  },
});

me.query = {
  type: me.type,
  resolve() {
    // const test = await User.findOne({}).
    // populate({
    //   path: 'profile',
    //   select: 'userId',
    // }).
    // exec(function (err, user) {
    //   if (err) return handleError(err);
    //   console.log('The profile is %s', user.profile);
    //   // prints "The author is Ian Fleming"
    // });

    const result = User.findOne({email: "kuakling@gmail.com"});
    // console.log(result);
    return result;
  }
}





/********** MUTATION ***********/

// User response object.  Use this whenever we're expecting a user, but there
// could also be an error
me.responseType = new GraphQLObjectType({
  name: 'UserResponse',
  description: 'User response, or error',
  fields() {
    return {
      ok: {
        type: GraphQLBoolean,
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
      user: {
        type: me.type,
        resolve(obj) {
          return obj.user;
        },
      },
    };
  },
});


// ----------------------
const createUser = (args) => {
  const user = new User({
    username: args.username,
    email: args.email,
    passwordHash: args.password
  });
  user.setPassword(args.password);
  user.setConfirmationToken();
  return user.save()
  .then(res => {
    // console.log(res);
    return {
      ok: true,
      user: res,
    };
  })
  .catch(err => {
    return {
      ok: false,
      errors: parseErrors(err.errors)
    };
  });
}
// Create a user via GraphQL mutations
me.signUpMutation = {
  type: me.responseType,
  args: {
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    confirm: {
      type: GraphQLString,
    },
  },
  resolve(_, args) {
    const user = createUser(args);
    return user;
  },
};



// CONFIRM SIGN UP USER
const signUpConfirm = async (args) => {
  const user = await User.findOneAndUpdate(
    {confirmationToken: args.token},
    {confirmationToken: "", confirmed: true, status: 1},
    { new: true }
  );
  if(user) {
    return {
      ok: true,
      user
    };
  }else{
    return {
      ok: false,
      errors: [{
        field: 'token',
        message: 'missing token or can not confirm'
      }]
    };
  }
}
me.signUpConfirmMutation = {
  type: me.responseType,
  args: {
    token: {
      type: GraphQLString
    }
  },
  async resolve(_, args) {
    const user = await signUpConfirm(args);
    console.log(user);
    return user;
  }
}



export const user = me;