import { Response, Request } from "express";
import userModel from "../model/userModel";
import cloudinary from "../utils/cloudinary";

import wordModel from "../model/wordModel";
import { Types } from "mongoose";
import meaningModel from "../model/meaningModel";

export const createWord = async (req: any, res: Response) => {
  try {
    const { word, meaning, useCase } = req.body;
    const { userID } = req.params;

    const user: any = await userModel.findById(userID);

    if (user) {
      // const { secure_url, public_id }: any = await cloudinary.uploader.upload(
      //   req.file.path
      // );

      const worded: any = await wordModel.create({
        word,
        // audio: secure_url,
        // audioID: public_id,
        postedBy: userID,
      });

      const wrdMeaning: any = await meaningModel.create({
        defined: meaning,
        useCase,

        definedBy: userID,
      });

      user?.wordsAdded?.push(new Types.ObjectId(worded?._id!));
      user?.save();

      worded?.meaning?.push(new Types.ObjectId(wrdMeaning?._id!));
      worded?.save();

      return res.status(201).json({
        message: "new word created successfully",
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

export const ReadAllWorded = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const words = await wordModel
      .find()
      .sort({ word: 1 })
      .collation({ locale: "en", strength: 2 });

    return res
      .status(200)
      .json({ message: "Reading all words", data: words, status: 200 });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error reading all words", status: 404 });
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

export const DeleteOneWord = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID, wordID } = req.params;
    const user: any = await userModel.findById(userID);
    const word = await wordModel.findByIdAndDelete(wordID);

    user?.addedWord?.pull(word?._id);
    user?.save();

    return res.status(200).json();
  } catch (error) {
    return res.status(404).json({ message: error, status: 404 });
  }
};

export const readMainFriendsWords = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user: any = await userModel.findById(userID);

    const friends = [...user.friends, userID];

    const words = await wordModel.find();

    let showWordPosted: Array<{}> = [];

    for (let i of words) {
      for (let e of friends) {
        if (i.postedBy === e) {
          showWordPosted.push(i);
        }
      }
    }

    return res.status(200).json({
      status: 200,
      data: showWordPosted.sort((a: any, b: any) => a.createdAt + b.createdAt),
      message: "reading friends post",
    });
  } catch (error) {
    return res.status(404).json({ message: error, status: 404 });
  }
};

export const searchWords = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { search } = req.body;
    const wordSearch = await wordModel.find({ title: search });

    return res.status(200).json({
      data: wordSearch,
      message: "words found",
    });
  } catch (error) {
    return res.status(404).json({ message: error, status: 404 });
  }
};
