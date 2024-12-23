"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const meaningModel = new mongoose_1.Schema({
    defined: {
        type: String,
    },
    definedBy: {
        type: String,
    },
    agreed: {
        type: [],
    },
    useCase: {
        type: [],
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("meanings", meaningModel);
