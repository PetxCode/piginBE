import { model, Schema, Types } from "mongoose";
import { iWordData } from "../utils/interfaces";

const wordModel = new Schema<iWordData>(
  {
    word: {
      type: String,
    },
    postedBy: {
      type: String,
    },
    audio: {
      type: String,
    },
    audioID: {
      type: String,
    },
    meaning: [
      {
        type: Types.ObjectId,
        ref: "meanings",
      },
    ],
  },
  { timestamps: true }
);

export default model<iWordData>("words", wordModel);
