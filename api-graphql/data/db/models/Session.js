import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import config from '../../../config';
import { checkPassword, encodeJWT, decodeJWT } from '../../../utils/hash';
import FormError from '../../../utils/error';
import { base64Encode, base64Decode } from '../../../utils/base64';

import User from './User';


const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiresAt: { type: Date, default: () => {
      const now = new Date();
      now.setDate(now.getDate() + 30);
      return now;
    }}
  },
  { timestamps: false }
);

schema.methods.jwt = function jwt() {
  return encodeJWT({
    id: this._id,
  })
}
schema.methods.getUser = async function getUser() {
  const user = await User.findById(this.userId);
  return user;
}


schema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const Model = mongoose.model("Session", schema); //กรณีตั้งชื่อตารางอัตโนมัติ จะใช้ชื่อตารางตาชื่ออากรูเมนต์แรก เป็นอักษรพิมพ์เล็ก และเติม s ต่อท้าย
// export default mongoose.model("User", schema, "user"); //กรณีบังคับชื่อตารางเองให้ใส่ชื่อตารางในอากรูเมนต์หลังสุด
export default Model; 




function createSession(user) {
  return Model.create({
    userId: user._id
  });
}

// Retrieve a session based on the JWT token.
export async function getSessionOnJWT(token) {
  const e = new FormError();
  let session;
  try {
    // Attempt to decode the JWT token
    const data = decodeJWT(token);

    // We should have an ID attribute
    if (!data.id) throw new Error();

    // Check that we've got a valid session
    session = await Model.findById(data.id);
    if (!session) throw new Error();
  } catch (_) {
    e.set('session', 'Invalid session ID');
  }

  // Throw if we have errors
  e.throwIf();

  return session;
}

export async function login(args) {
  const e = new FormError();

  if (!args.identity) {
    e.set('identity', 'Please enter your username or e-mail address.');
  } 

  // if (!data.password) {
  //   e.set('password', 'Please enter your password.');
  // } else if (data.password.length < 6 || data.password.length > 64) {
  //   e.set('password', 'Please enter a password between 6 and 64 characters in length');
  // }

  e.throwIf();

  const user = await User.findOne({$or: [
    {username: args.identity},
    {email: args.identity}
  ]});
  // If we don't have a valid user, throw.
  if (!user) {
    e.set('identity', 'An account with that username or e-mail does not exist.');
  }
  e.throwIf();

  if (!user.confirmed) {
    e.set('identity', 'Please activate your account.');
  }
  if (user.status !== 1) {
    e.set('identity', 'Your account is not available');
  }
  e.throwIf();

  // Check that the passwords match
  if (!await checkPassword(args.password, user.passwordHash)) {
    e.set('password', 'Your password is incorrect.');
  }

  e.throwIf();
  
  // Create the new session
  const sessionUser = await createSession(user);
  // console.log(sessionUser);
  return sessionUser;
}