import { Router } from "express";

import {
  createWord,
  DeleteOneWord,
  ReadAllWorded,
  readMainFriendsWords,
  ReadOneWordDetail,
  searchWords,
} from "../controller/wordController";
import { uploadAvatarImage } from "../utils/multer";

const router: any = Router();

router.route("/create-new-word/:userID").post(
  // uploadAvatarImage,
  createWord
);

router.route("/read-word/").get(ReadAllWorded);
router.route("/read-one-word/:wordID").get(ReadOneWordDetail);
router.route("/read-friends-word/:userID").get(readMainFriendsWords);
router.route("/search-word/").get(searchWords);

router.route("/delete-one-word/:userID/:wordID").delete(DeleteOneWord);

export default router;
