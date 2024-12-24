"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mostWordedMeaning = exports.DelateOneWordMeaning = exports.ReadOneWordDetail = exports.ReadAllWordedMeaning = exports.agreedDefined = exports.createMeaning = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const wordModel_1 = __importDefault(require("../model/wordModel"));
const mongoose_1 = require("mongoose");
const meaningModel_1 = __importDefault(require("../model/meaningModel"));
const lodash_1 = __importDefault(require("lodash"));
const createMeaning = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { defined, useCase } = req.body;
        const { userID, wordID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const findWord = yield wordModel_1.default.findById(wordID);
        if (user && findWord) {
            const worded = yield meaningModel_1.default.create({
                defined,
                useCase,
                definedBy: userID,
            });
            (_a = findWord === null || findWord === void 0 ? void 0 : findWord.meaning) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.Types.ObjectId(worded === null || worded === void 0 ? void 0 : worded._id));
            findWord === null || findWord === void 0 ? void 0 : findWord.save();
            return res.status(201).json({
                message: "definition for word, created successfully",
                data: worded,
                status: 201,
            });
        }
        else {
            return res.status(404).json({ message: "no user matches" });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.createMeaning = createMeaning;
const agreedDefined = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, wordID } = req.params;
        const getUser = yield userModel_1.default.findById(userID);
        const findWord = yield meaningModel_1.default.findById(wordID);
        if (getUser && findWord) {
            const check = findWord === null || findWord === void 0 ? void 0 : findWord.agreed.some((el) => el === userID);
            if (check) {
                return res.status(404).json({
                    message: "You've already agreed to this definition",
                    status: 404,
                });
            }
            else {
                const getWord = yield meaningModel_1.default.findByIdAndUpdate(wordID, {
                    agreed: [...findWord.agreed, userID],
                }, { new: true });
                return res.status(201).json({
                    message: "agreed update successfully",
                    data: getWord,
                    status: 201,
                });
            }
        }
        else {
            return res
                .status(400) // Changed to 400 for a more appropriate error status
                .json({ message: "deos not exist" });
        }
    }
    catch (error) {
        return res
            .status(400) // Changed to 400 for a more appropriate error status
            .json({ message: "User not update", error: error.message });
    }
});
exports.agreedDefined = agreedDefined;
const ReadAllWordedMeaning = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wordID } = req.params;
        const wordsMeaning = yield wordModel_1.default.findById(wordID).populate({
            path: "meaning",
        });
        return res.status(200).json({
            message: "Reading all words",
            data: wordsMeaning,
            status: 200,
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error reading all words", sorted: 404 });
    }
});
exports.ReadAllWordedMeaning = ReadAllWordedMeaning;
const ReadOneWordDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wordID } = req.params;
        const user = yield wordModel_1.default.findById(wordID).populate({
            path: "addedWord",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res
            .status(200)
            .json({ message: "Reading user word", data: user, status: 200 });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error reading user word", status: 404 });
    }
});
exports.ReadOneWordDetail = ReadOneWordDetail;
const DelateOneWordMeaning = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userID, wordID, meaningID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const word = yield wordModel_1.default.findById(wordID);
        if (user) {
            yield meaningModel_1.default.findByIdAndDelete(meaningID);
            (_a = word === null || word === void 0 ? void 0 : word.meaning) === null || _a === void 0 ? void 0 : _a.pull(meaningID);
            word === null || word === void 0 ? void 0 : word.save();
            return res.status(200).json({ message: "meaning delete" });
        }
        else {
            return res.status(404).json({ message: "Error", status: 404 });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error, status: 404 });
    }
});
exports.DelateOneWordMeaning = DelateOneWordMeaning;
const mostWordedMeaning = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wordID } = req.params;
        const wordsMeaning = yield wordModel_1.default.findById(wordID).populate({
            path: "meaning",
        });
        let val = [
            { name: "Peter", count: [1, 5, 6] },
            { name: "James", count: [1, 5] },
            { name: "Oti", count: [1, 5, 6, 9] },
            { name: "Star", count: [1, 5, 6, 9, 0, 2] },
        ];
        let read = lodash_1.default.orderBy(val, (item) => item.count.length, "desc");
        return res
            .status(200)
            .json({ message: "Reading all words", data: wordsMeaning, status: 200 });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error reading all words", status: 404 });
    }
});
exports.mostWordedMeaning = mostWordedMeaning;
