// ----------------------
// IMPORTS
import path from 'path';
import fs from 'fs';
import mime from 'mime';
import config from '../../config';

// GraphQL schema library, for building our GraphQL schema
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql';
import { FieldType } from './form';

import { getSessionOnJWT } from '../db/models/Session';
import FormError from '../../utils/error';
import { notStringToString } from '../../utils/string';
import UserProfile, { updateByUserId } from '../db/models/UserProfile';

const me = {};
const userDir = path.join(config.upload.baseDir, config.modules.user.upload.path);

const updateProfile = async (args, ctx) => {
  try {
    const session = await getSessionOnJWT(ctx.state.jwt);
    const profile = await updateByUserId(args, session.userId);
    return {
      ok: true,
      profile
    }
  } catch (error) {
    return {
      ok: false,
      errors: error
    }
  }
}

const imageList = (obj, type) => {
  const images = [];
  try {
    const dir = path.join(userDir, obj.userId.toString(), config.modules.user[type].path);
    if (!fs.existsSync(dir)) throw new Error();
    
    fs.readdirSync(dir).filter((file) => {
      const filename = path.join(dir, file);
      if( fs.lstatSync(filename).isFile() && mime.lookup(filename).substr(0, 5) === 'image' && file.lastIndexOf('_cropped.png') === -1){ 
        const isCurrent = file === obj[type] ? true : false;
        images.push({file, isCurrent});
      }
    })
    return images;
  } catch (error) {
    return [];
  }
}

const fileExists = (obj, field, name) => {
  if(!obj.userId || !obj[field]) return false;
  const mUser = config.modules.user,
  filename = path.join(userDir, obj.userId.toString(), mUser[field].path, obj[name]),
  isExists = (fs.existsSync(filename)) ? true : false;

  return isExists;
};

me.avatarsType = new GraphQLObjectType({
  name: 'AvatarsType',
  fields() {
    return {
      file :{ type: GraphQLString },
      isCurrent: { type: GraphQLBoolean }
    }
  }
});

me.coversType = new GraphQLObjectType({
  name: 'CoversType',
  fields() {
    return {
      file :{ type: GraphQLString },
      isCurrent: { type: GraphQLBoolean }
    }
  }
});

// Message type.  Imagine this like static type hinting on the 'message'
// object we're going to throw back to the user
me.type = new GraphQLObjectType({
  name: 'UserProfile',
  description: 'GraphQL server user profile',
  fields() {
    return {
      _id: {
        type: GraphQLID,
      },
      // userId: {
      //   type: GraphQLString,
      //   resolve(obj) { return obj.userId || '' },
      // },
      userId: {
        type: GraphQLID,
      },
      firstName: {
        type: GraphQLString,
        resolve(obj) { return notStringToString(obj.firstName) },
      },
      lastName: {
        type: GraphQLString,
        resolve(obj) { return notStringToString(obj.lastName) },
      },
      avatar: { 
        type: GraphQLString,
        resolve(obj) { return notStringToString(obj.avatar) },
      },
      avatarExists: {
        type: GraphQLBoolean,
        resolve(obj) {
          // const mUser = config.modules.user,
          //       filename = path.join(userDir, mUser.avatar.path, obj.userId.toString(), obj.avatar),
          //       isExists = (fs.existsSync(filename)) ? true : false
          // return isExists
          return fileExists(obj, 'avatar', 'avatar');
        }
      },
      avatarCropped: { 
        type: GraphQLString,
        resolve(obj) { return notStringToString(obj.avatarCropped) },
      },
      avatarCroppedExists: {
        type: GraphQLBoolean,
        resolve(obj) {
          // const mUser = config.modules.user,
          //       filename = path.join(userDir, mUser.avatar.path, obj.userId.toString(), obj.avatarCropped),
          //       isExists = (fs.existsSync(filename)) ? true : false
          //       // console.log('avatar_cropped is ', isExists, ' ', filename)
          // return isExists
          return fileExists(obj, 'avatar', 'avatarCropped');
        }
      },
      avatarOffset: { 
        type: GraphQLString,
        resolve(obj) { return notStringToString(obj.avatarOffset) },
      },
      avatarFiles: {
        type: new GraphQLList(me.avatarsType),
        resolve(obj) {
          return imageList(obj, 'avatar');
          // return [];
        }
      },
      cover: { 
        type: GraphQLString,
        resolve(obj) { return notStringToString(obj.cover) },
      },
      coverExists: {
        type: GraphQLBoolean,
        resolve(obj) {
          return fileExists(obj, 'cover', 'cover');
        }
      },
      coverCropped: { 
        type: GraphQLString,
        resolve(obj) { return notStringToString(obj.coverCropped) },
      },
      coverCroppedExists: {
        type: GraphQLBoolean,
        resolve(obj) {
          return fileExists(obj, 'cover', 'coverCropped');
        }
      },
      coverOffset: { 
        type: GraphQLString,
        resolve(obj) { return notStringToString(obj.coverOffset) },
      },
      coverFiles: {
        type: new GraphQLList(me.coversType),
        resolve(obj) {
          // const dirTarget = path.join(userDir, obj.userId.toString(), config.modules.user.avatar.path);
          // console.log(dirTarget);
          return imageList(obj, 'cover');
          // return [];
        }
      },
      createdAt: {
        type: GraphQLString,
      },
      updatedAt: {
        type: GraphQLString,
      },
    };
  },
});

me.query = {
  type: me.type,
  async resolve() {
    const result = await UserProfile.findOne();
    // console.log(result);
    return result;
  }
}




//////////////Mutation//////////////
me.responseType = new GraphQLObjectType({
  name: 'UserProfileResponse',
  description: 'User profile response, or error',
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
      profile: {
        type: me.type,
        resolve(obj) {
          return obj.profile;
        },
      },
    };
  },
});

// Create a user via GraphQL mutations
me.updateMutation = {
  type: me.responseType,
  args: {
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    // avatar_offset: {
    //   type: GraphQLString,
    // },
    // avatar_cropped: {
    //   type: GraphQLString,
    // },
    // avatar: {
    //   type: GraphQLString,
    // },
    // cover_offset: {
    //   type: GraphQLString,
    // },
    // cover_cropped: {
    //   type: GraphQLString,
    // },
    // cover: {
    //   type: GraphQLString,
    // },
    bio: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args, ctx) {
    const profile = await updateProfile(args, ctx);
    return profile;
  },
};


me.changeAvatarMutation = {
  type: me.responseType,
  args: {
    avatarOffset: {
      type: GraphQLString,
    },
    avatarCropped: {
      type: GraphQLString,
    },
    avatar: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args, ctx) {
    const profile = await updateProfile(args, ctx);
    return profile;
  },
}

me.deleteAvatarMutation = {
  type: me.responseType,
  args: {
    avatar: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args, ctx) {
    const session = await getSessionOnJWT(ctx.state.jwt);
    console.log(session);
    const profile = await UserProfile.findOne({userId: session.userId});
    const fileForRm = path.join(
      config.upload.baseDir, 
      config.modules.user.upload.path,
      profile.userId.toString(), 
      config.modules.user.avatar.path,
      args.avatar
    )
    if (fs.existsSync(fileForRm)) {
      fs.unlinkSync(fileForRm)
      console.log('Delete -> ', fileForRm)
    }else{
      console.error('File not found -> ', fileForRm)
    }
    return {
      ok: false,
      profile
    }
  },
}

me.changeCoverMutation = {
  type: me.responseType,
  args: {
    coverOffset: {
      type: GraphQLString,
    },
    coverCropped: {
      type: GraphQLString,
    },
    cover: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args, ctx) {
    const profile = await updateProfile(args, ctx);
    return profile;
  },
}

me.deleteCoverMutation = {
  type: me.responseType,
  args: {
    cover: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args, ctx) {
    const session = await getSessionOnJWT(ctx.state.jwt);
    const profile = await UserProfile.findOne({userId: session.userId});
    const fileForRm = path.join(
      config.upload.baseDir, 
      config.modules.user.upload.path,
      profile.userId.toString(), 
      config.modules.user.cover.path,
      args.cover
    )
    if (fs.existsSync(fileForRm)) {
      fs.unlinkSync(fileForRm)
      console.log('Delete -> ', fileForRm)
    }else{
      console.error('File not found -> ', fileForRm)
    }
    return {
      ok: false,
      profile
    }
  },
}

export const userProfile = me;