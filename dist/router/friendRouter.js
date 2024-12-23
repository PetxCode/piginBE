"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const makeFriend_1 = require("../controller/makeFriend");
const router = (0, express_1.Router)();
router.route("/add-friends/:userID/:friendID").patch(makeFriend_1.addAsFriend);
router.route("/un-friends/:userID/:friendID").patch(makeFriend_1.unFriend);
exports.default = router;
