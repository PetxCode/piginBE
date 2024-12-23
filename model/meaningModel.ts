import { model, Schema, Types } from "mongoose";
import { iMeaningData } from "../utils/interfaces";

const meaningModel = new Schema<iMeaningData>(
  {
    defined: {
      type: String,
    },
    definedBy: {
      type: String,
    },

    agreed: {
      type: [],
    },

    useCase: {
      type: [],
    },
  },
  { timestamps: true }
);

export default model<iMeaningData>("meanings", meaningModel);
