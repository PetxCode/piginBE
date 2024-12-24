import { Request, Response } from "express";
import userModel from "../model/userModel";

export const addAsFriend = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const user: any = await userModel.findById(userID);
    const friend: any = await userModel.findById(friendID);

    if (!user && !friend) {
      return res.status(404).json({
        message: "Error ",
        status: 404,
      });
    } else {
      const check = user?.friends.some((el: any) => el === friendID);

      if (check) {
        return res.status(404).json({
          message: "You are already friends",
          status: 404,
        });
      } else {
        await userModel.findByIdAndUpdate(
          userID,
          {
            friends: [...user?.friends, friendID],
            followings: [...user?.followings, friendID],
          },
          { new: true }
        );

        // friend?.friends.push(userID);
        // friend?.followers.push(userID);

        await userModel.findByIdAndUpdate(
          friendID,
          {
            friends: [...friend?.friends, userID],
            followers: [...friend?.followers, userID],
          },
          { new: true }
        );

        return res.status(201).json({
          message: "Friend added successfully",
          status: 201,
        });
      }
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating friend",
      data: error.message,
      status: 404,
    });
  }
};

export const unFriend = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const user: any = await userModel.findById(userID);
    const friend: any = await userModel.findById(friendID);

    if (!user && !friend) {
      return res.status(404).json({
        message: "Error creating friend",
        status: 404,
      });
    } else {
      const check = user?.friends.some((el: any) => el === friendID);

      if (!check) {
        return res.status(404).json({
          message: "You are not friends",
          status: 404,
        });
      } else {
        await userModel.findByIdAndUpdate(
          userID,
          {
            friends: user?.friends.filter((el: any) => el !== friendID),
            following: user?.following.filter((el: any) => el !== friendID),
          },
          { new: true }
        );

        await userModel.findByIdAndUpdate(
          friendID,
          {
            friends: friend?.friends.filter((el: any) => el !== userID),
            following: friend?.following.filter((el: any) => el !== userID),
          },
          { new: true }
        );
        return res.status(201).json({
          message: "Friend remove successfully",
          status: 201,
        });
      }
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error creating friend",
      status: 404,
    });
  }
};
