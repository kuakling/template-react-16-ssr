import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import config from '../../../config';
import { base64Encode, base64Decode } from '../../../utils/base64';

import UserProfile from './UserProfile';


const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true
    },
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
    confirmationToken: { type: String, default: "" },
    socialId: {
      google: { type: String, default: null },
    }
  },
  { timestamps: true }
);

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.getProfile = function getProfile() {
  const profile = UserProfile.findOne({userId: this._id});
  return profile;
}

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = base64Encode(this.generateJWT());
};

schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
  return `${process.env.HOST}/confirm/${this.confirmationToken}`;
};

// schema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
//   return `${process.env
//     .HOST}/reset_password/${this.generateResetPasswordToken()}`;
// };

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
    email: this.email,
    confirmed: this.confirmed
  }, config.jwt.secretKey);
};

// schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
//   return jwt.sign(
//     {
//       _id: this._id
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );
// };

// schema.methods.toAuthJSON = function toAuthJSON() {
//   return {
//     email: this.email,
//     confirmed: this.confirmed,
//     token: this.generateJWT()
//   };
// };

schema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

// export default mongoose.model("User", schema, "user"); //กรณีบังคับชื่อตารางเองให้ใส่ชื่อตารางในอากรูเมนต์หลังสุด
export default mongoose.model("User", schema); //กรณีตั้งชื่อตารางอัตโนมัติ จะใช้ชื่อตารางตาชื่ออากรูเมนต์แรก เป็นอักษรพิมพ์เล็ก และเติม s ต่อท้าย