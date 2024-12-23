import { Response, Request } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import { changePassword, verifiedEmail } from "../utils/email";
import cloudinary from "../utils/cloudinary";
import fs from "node:fs";
import path from "node:path";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById(userID);

    return res
      .status(201)
      .json({ message: "got user successfully", data: user, status: 200 });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find();

    return res
      .status(201)
      .json({ message: "created successfully", data: user, status: 200 });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, userName } = req.body;
    console.log("hashed");

    const token = crypto.randomBytes(3).toString("hex");
    const coded = crypto.randomBytes(3).toString("hex");

    const salt = await bcrypt.genSalt(10);
    console.log("stru");
    const hashed = await bcrypt.hash(password, salt);

    console.log(email, password, userName);

    const user = await userModel.create({
      email,
      userName,
      password: hashed,
      verifyToken: token,
      userCode: coded,
    });

    verifiedEmail(user).then(() => {
      console.log("sent email");
    });

    return res
      .status(201)
      .json({ message: "created successfully", data: user, status: 201 });
  } catch (error: any) {
    return res.status(404).json({ message: error?.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email,
    });

    if (user) {
      const pass = await bcrypt.compare(password, user?.password);

      if (pass) {
        if (user.isVerify) {
          return res
            .status(201)
            .json({ message: "login successfully", data: user, status: 201 });
        } else {
          return res.status(404).json({
            message: "Account hasn't been verified",
          });
        }
      } else {
        return res.status(404).json({
          message: "Wrong Password",
        });
      }
    } else {
      return res.status(404).json({
        message: "Email is incorrect",
      });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const verifyUserAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const accountUser = await userModel.findById(userID);

    if (accountUser) {
      const user = await userModel.findByIdAndUpdate(
        userID,
        {
          verifyToken: "",
          isVerify: true,
        },
        { new: true }
      );

      return res.status(201).json({
        message: "user account verified successfully",
        data: user,
        status: 201,
      });
    } else {
      return res.status(404).json({ message: "Invalid token" });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const forgetUserPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const token = crypto.randomBytes(3).toString("hex");

    const getUser = await userModel.findOne({ email });

    if (getUser && getUser?.isVerify) {
      const user = await userModel.findByIdAndUpdate(
        getUser?._id,
        {
          verifyToken: token,
        },
        { new: true }
      );

      changePassword(getUser);

      return res
        .status(201)
        .json({ message: "created successfully", data: user, status: 201 });
    } else {
      return res.status(404).json({ message: "user can't be found" });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { userID } = req.params;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const getUser = await userModel.findById(userID);

    if (getUser && getUser?.isVerify && getUser?.verifyToken !== "") {
      const user = await userModel.findByIdAndUpdate(
        getUser?._id,
        {
          verifyToken: "",
          password: hashed,
        },
        { new: true }
      );

      return res
        .status(201)
        .json({ message: "created successfully", data: user, status: 201 });
    } else {
      return res.status(404).json({ message: "user can't be found" });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { userName, password } = req.body;
    const salt = await bcrypt.genSalt(10);

    const hashed = await bcrypt.hash(password, salt);

    const getUser = await userModel.findById(userID);
    if (getUser) {
      const user = await userModel.findByIdAndUpdate(
        userID,
        {
          userName,
          password: hashed,
        },
        { new: true }
      );

      return res
        .status(201)
        .json({ message: "User update successfully", data: user, status: 201 });
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

export const updateUserAvatar = async (req: any, res: Response) => {
  try {
    const { userID } = req.params;

    const getUser = await userModel.findById(userID);
    if (getUser) {
      let filePath = path.join(__dirname, "../uploads/avatar");

      const deleteFilesInFolder = (folderPath: any) => {
        if (fs.existsSync(folderPath)) {
          const files = fs.readdirSync(folderPath);

          files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
          });

          console.log(
            `All files in the folder '${folderPath}' have been deleted.`
          );
        } else {
          console.log(`The folder '${folderPath}' does not exist.`);
        }
      };

      const { secure_url } = await cloudinary.uploader.upload(req.file.path);

      const user = await userModel.findByIdAndUpdate(
        userID,
        {
          avatar: secure_url,
        },
        { new: true }
      );

      deleteFilesInFolder(filePath);

      return res
        .status(201)
        .json({ message: "User update successfully", data: user, status: 201 });
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

export const updateUserInfo = async (req: any, res: Response) => {
  try {
    const { userID } = req.params;
    const { userName, bio, location } = req.body;

    const getUser = await userModel.findById(userID);
    if (getUser) {
      const user = await userModel.findByIdAndUpdate(
        userID,
        {
          userName,
          bio,
          location,
        },
        { new: true }
      );

      return res
        .status(201)
        .json({ message: "User update successfully", data: user, status: 201 });
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
