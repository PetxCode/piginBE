import { model, Schema, Types } from "mongoose";
import { iUserData } from "../utils/interfaces";

const userModel = new Schema<iUserData>(
  {
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
    },
    userName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    verifyToken: {
      type: String,
    },
    userCode: {
      type: String,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },

    friends: {
      type: [],
    },

    followings: {
      type: [],
    },

    followers: {
      type: [],
    },

    wordsAdded: [
      {
        type: Types.ObjectId,
        ref: "words",
      },
    ],
  },
  { timestamps: true }
);

export default model<iUserData>("users", userModel);
