"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meaningController_1 = require("../controller/meaningController");
const router = (0, express_1.Router)();
router.route("/add-meaning/:userID/:wordID").post(meaningController_1.createMeaning);
router.route("/agreed-meaning/:userID/:wordID").patch(meaningController_1.agreedDefined);
router.route("/read-all-meaning/:wordID").get(meaningController_1.ReadAllWordedMeaning);
router.route("/read-one-meaning/:wordID").get(meaningController_1.ReadOneWordDetail);
router
    .route("/delete-one-meaning/userID/:wordID/:meaningID")
    .delete(meaningController_1.ReadOneWordDetail);
exports.default = router;
