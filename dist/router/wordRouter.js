"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wordController_1 = require("../controller/wordController");
const router = (0, express_1.Router)();
router.route("/create-new-word/:userID").post(
// uploadAvatarImage,
wordController_1.createWord);
router.route("/read-word/").get(wordController_1.ReadAllWorded);
router.route("/read-one-word/:wordID").get(wordController_1.ReadOneWordDetail);
router.route("/read-friends-word/:userID").get(wordController_1.readMainFriendsWords);
router.route("/search-word/").get(wordController_1.searchWords);
router.route("/delete-one-word/:userID/:wordID").delete(wordController_1.DeleteOneWord);
exports.default = router;
