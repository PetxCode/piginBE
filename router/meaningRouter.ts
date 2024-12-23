import { Router } from "express";
import {
  agreedDefined,
  createMeaning,
  ReadAllWordedMeaning,
  ReadOneWordDetail,
} from "../controller/meaningController";

const router: any = Router();

router.route("/add-meaning/:userID/:wordID").post(createMeaning);

router.route("/agreed-meaning/:userID/:wordID").patch(agreedDefined);

router.route("/read-all-meaning/:wordID").get(ReadAllWordedMeaning);
router.route("/read-one-meaning/:wordID").get(ReadOneWordDetail);

router
  .route("/delete-one-meaning/userID/:wordID/:meaningID")
  .delete(ReadOneWordDetail);

export default router;
