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
exports.searchWords = exports.readMainFriendsWords = exports.DeleteOneWord = exports.ReadOneWordDetail = exports.ReadAllWorded = exports.createWord = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const wordModel_1 = __importDefault(require("../model/wordModel"));
const mongoose_1 = require("mongoose");
const meaningModel_1 = __importDefault(require("../model/meaningModel"));
const createWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { word, meaning, useCase } = req.body;
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            // const { secure_url, public_id }: any = await cloudinary.uploader.upload(
            //   req.file.path
            // );
            const worded = yield wordModel_1.default.create({
                word,
                // audio: secure_url,
                // audioID: public_id,
                postedBy: userID,
            });
            const wrdMeaning = yield meaningModel_1.default.create({
                defined: meaning,
                useCase,
                definedBy: userID,
            });
            (_a = user === null || user === void 0 ? void 0 : user.wordsAdded) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.Types.ObjectId(worded === null || worded === void 0 ? void 0 : worded._id));
            user === null || user === void 0 ? void 0 : user.save();
            (_b = worded === null || worded === void 0 ? void 0 : worded.meaning) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.Types.ObjectId(wrdMeaning === null || wrdMeaning === void 0 ? void 0 : wrdMeaning._id));
            worded === null || worded === void 0 ? void 0 : worded.save();
            return res.status(201).json({
                message: "new word created successfully",
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
exports.createWord = createWord;
const ReadAllWorded = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const words = yield wordModel_1.default
            .find()
            .sort({ word: 1 })
            .collation({ locale: "en", strength: 2 });
        return res
            .status(200)
            .json({ message: "Reading all words", data: words, status: 200 });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error reading all words", status: 404 });
    }
});
exports.ReadAllWorded = ReadAllWorded;
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
const DeleteOneWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userID, wordID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const word = yield wordModel_1.default.findByIdAndDelete(wordID);
        (_a = user === null || user === void 0 ? void 0 : user.addedWord) === null || _a === void 0 ? void 0 : _a.pull(word === null || word === void 0 ? void 0 : word._id);
        user === null || user === void 0 ? void 0 : user.save();
        return res.status(200).json();
    }
    catch (error) {
        return res.status(404).json({ message: error, status: 404 });
    }
});
exports.DeleteOneWord = DeleteOneWord;
const readMainFriendsWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const friends = [...user.friends, userID];
        const words = yield wordModel_1.default.find();
        let showWordPosted = [];
        for (let i of words) {
            for (let e of friends) {
                if (i.postedBy === e) {
                    showWordPosted.push(i);
                }
            }
        }
        return res.status(200).json({
            status: 200,
            data: showWordPosted.sort((a, b) => a.createdAt + b.createdAt),
            message: "reading friends post",
        });
    }
    catch (error) {
        return res.status(404).json({ message: error, status: 404 });
    }
});
exports.readMainFriendsWords = readMainFriendsWords;
const searchWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.body;
        const wordSearch = yield wordModel_1.default.find({ title: search });
        return res.status(200).json({
            data: wordSearch,
            message: "words found",
        });
    }
    catch (error) {
        return res.status(404).json({ message: error, status: 404 });
    }
});
exports.searchWords = searchWords;
