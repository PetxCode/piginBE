import { Response, Request } from "express";
import userModel from "../model/userModel";
import cloudinary from "../utils/cloudinary";

import wordModel from "../model/wordModel";
import { Types } from "mongoose";
import meaningModel from "../model/meaningModel";
import _ from "lodash";

export const createMeaning = async (req: any, res: Response) => {
  try {
    const { defined, useCase } = req.body;
    const { userID, wordID } = req.params;

    const user: any = await userModel.findById(userID);
    const findWord: any = await wordModel.findById(wordID);

    if (user && findWord) {
      const worded: any = await meaningModel.create({
        defined,
        useCase,
        definedBy: userID,
      });

      findWord?.meaning?.push(new Types.ObjectId(worded?._id!));
      findWord?.save();

      return res.status(201).json({
        message: "definition for word, created successfully",
        data: worded,
        status: 201,
      });
    } else {
      return res.status(404).json({ message: "no user matches" });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const agreedDefined = async (req: any, res: Response) => {
  try {
    const { userID, wordID } = req.params;

    const getUser = await userModel.findById(userID);
    const findWord: any = await meaningModel.findById(wordID);

    if (getUser && findWord) {
      const getWord = await meaningModel.findByIdAndUpdate(
        wordID,
        {
          agreed: [...findWord.agreed, userID],
        },
        { new: true }
      );

      return res.status(201).json({
        message: "agreed update successfully",
        data: getWord,
        status: 201,
      });
    } else {
      return res
        .status(400) // Changed to 400 for a more appropriate error status
        .json({ message: "deos not exist" });
    }
  } catch (error: any) {
    return res
      .status(400) // Changed to 400 for a more appropriate error status
      .json({ message: "User not update", error: error.message });
  }
};

export const ReadAllWordedMeaning = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { wordID } = req.params;
    const wordsMeaning: any = await wordModel.findById(wordID).populate({
      path: "meaning",
    });

    return res.status(200).json({
      message: "Reading all words",
      data: wordsMeaning,
      status: 200,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error reading all words", sorted: 404 });
  }
};

export const ReadOneWordDetail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { wordID } = req.params;
    const user = await wordModel.findById(wordID).populate({
      path: "addedWord",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res
      .status(200)
      .json({ message: "Reading user word", data: user, status: 200 });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error reading user word", status: 404 });
  }
};

export const DelateOneWordMeaning = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID, wordID, meaningID } = req.params;

    const user: any = await userModel.findById(userID);
    const word: any = await wordModel.findById(wordID);

    if (user) {
      await meaningModel.findByIdAndDelete(meaningID);

      word?.meaning?.pull(meaningID);
      word?.save();

      return res.status(200).json({ message: "meaning delete" });
    } else {
      return res.status(404).json({ message: "Error", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: error, status: 404 });
  }
};

export const mostWordedMeaning = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { wordID } = req.params;
    const wordsMeaning = await wordModel.findById(wordID).populate({
      path: "meaning",
    });

    let val = [
      { name: "Peter", count: [1, 5, 6] },
      { name: "James", count: [1, 5] },
      { name: "Oti", count: [1, 5, 6, 9] },
      { name: "Star", count: [1, 5, 6, 9, 0, 2] },
    ];

    let read = _.orderBy(val, (item) => item.count.length, "desc");
    return res
      .status(200)
      .json({ message: "Reading all words", data: wordsMeaning, status: 200 });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error reading all words", status: 404 });
  }
};
