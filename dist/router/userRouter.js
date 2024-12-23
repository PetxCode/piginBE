"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
router.route("/create-user").post(userController_1.createUser);
router.route("/login-user").post(userController_1.loginUser);
router.route("/forget-password").post(userController_1.forgetUserPassword);
router.route("/change-password/:userID").patch(userController_1.resetUserPassword);
router
    .route("/update-avatar/:userID")
    .patch(multer_1.uploadAvatarImage, userController_1.updateUserAvatar);
router.route("/update-info/:userID").patch(userController_1.updateUserInfo);
router.route("/verify-user/:userID").get(userController_1.verifyUserAccount);
router.route("/users").get(userController_1.getAllUser);
router.route("/user/:userID").get(userController_1.getUser);
exports.default = router;
