import mongoose from "mongoose";
import FormError from '../../../utils/error';


const schema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
    avatarCropped: { type: String },
    avatarOffset: { type: String },
    cover: { type: String },
    coverCropped: { type: String },
    coverOffset: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const model = mongoose.model("UserProfile", schema);
export default model;


export const updateByUserId = async (
  data,
  userId,
  options={ upsert: true, new: true, setDefaultsOnInsert: true }
) => {
  const e = new FormError();
  try{
    const profile = await model.findOneAndUpdate(
      { userId },
      data,
      options
    );
    if (!profile) throw new Error();
    return profile;
  }catch (_) {
    e.set('profile', 'Invalid profile');
  }
  e.throwIf();
  return;
} 