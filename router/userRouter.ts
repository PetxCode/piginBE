import { Router } from "express";
import {
  getAllUser,
  createUser,
  verifyUserAccount,
  loginUser,
  forgetUserPassword,
  resetUserPassword,
  updateUserAvatar,
  updateUserInfo,
  getUser,
} from "../controller/userController";
import { uploadAvatarImage } from "../utils/multer";

const router: any = Router();

router.route("/create-user").post(createUser);
router.route("/login-user").post(loginUser);
router.route("/forget-password").post(forgetUserPassword);

router.route("/change-password/:userID").patch(resetUserPassword);

router
  .route("/update-avatar/:userID")
  .patch(uploadAvatarImage, updateUserAvatar);
router.route("/update-info/:userID").patch(updateUserInfo);

router.route("/verify-user/:userID").get(verifyUserAccount);

router.route("/users").get(getAllUser);

router.route("/user/:userID").get(getUser);

export default router;
