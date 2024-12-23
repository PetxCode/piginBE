"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const wordModel = new mongoose_1.Schema({
    word: {
        type: String,
    },
    postedBy: {
        type: String,
    },
    audio: {
        type: String,
    },
    audioID: {
        type: String,
    },
    meaning: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "meanings",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("words", wordModel);
