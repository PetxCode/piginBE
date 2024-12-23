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
exports.updateUserInfo = exports.updateUserAvatar = exports.updateUserPassword = exports.resetUserPassword = exports.forgetUserPassword = exports.verifyUserAccount = exports.loginUser = exports.createUser = exports.getAllUser = exports.getUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../model/userModel"));
const email_1 = require("../utils/email");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        return res
            .status(201)
            .json({ message: "got user successfully", data: user, status: 200 });
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.getUser = getUser;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        return res
            .status(201)
            .json({ message: "created successfully", data: user, status: 200 });
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.getAllUser = getAllUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, userName } = req.body;
        console.log("hashed");
        const token = crypto_1.default.randomBytes(3).toString("hex");
        const coded = crypto_1.default.randomBytes(3).toString("hex");
        const salt = yield bcrypt_1.default.genSalt(10);
        console.log("stru");
        const hashed = yield bcrypt_1.default.hash(password, salt);
        console.log(email, password, userName);
        const user = yield userModel_1.default.create({
            email,
            userName,
            password: hashed,
            verifyToken: token,
            userCode: coded,
        });
        (0, email_1.verifiedEmail)(user).then(() => {
            console.log("sent email");
        });
        return res
            .status(201)
            .json({ message: "created successfully", data: user, status: 201 });
    }
    catch (error) {
        return res.status(404).json({ message: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({
            email,
        });
        if (user) {
            const pass = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (pass) {
                if (user.isVerify) {
                    return res
                        .status(201)
                        .json({ message: "login successfully", data: user, status: 201 });
                }
                else {
                    return res.status(404).json({
                        message: "Account hasn't been verified",
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "Wrong Password",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Email is incorrect",
            });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
const verifyUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const accountUser = yield userModel_1.default.findById(userID);
        if (accountUser) {
            const user = yield userModel_1.default.findByIdAndUpdate(userID, {
                verifyToken: "",
                isVerify: true,
            }, { new: true });
            return res.status(201).json({
                message: "user account verified successfully",
                data: user,
                status: 201,
            });
        }
        else {
            return res.status(404).json({ message: "Invalid token" });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.verifyUserAccount = verifyUserAccount;
const forgetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const token = crypto_1.default.randomBytes(3).toString("hex");
        const getUser = yield userModel_1.default.findOne({ email });
        if (getUser && (getUser === null || getUser === void 0 ? void 0 : getUser.isVerify)) {
            const user = yield userModel_1.default.findByIdAndUpdate(getUser === null || getUser === void 0 ? void 0 : getUser._id, {
                verifyToken: token,
            }, { new: true });
            (0, email_1.changePassword)(getUser);
            return res
                .status(201)
                .json({ message: "created successfully", data: user, status: 201 });
        }
        else {
            return res.status(404).json({ message: "user can't be found" });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.forgetUserPassword = forgetUserPassword;
const resetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const { userID } = req.params;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const getUser = yield userModel_1.default.findById(userID);
        if (getUser && (getUser === null || getUser === void 0 ? void 0 : getUser.isVerify) && (getUser === null || getUser === void 0 ? void 0 : getUser.verifyToken) !== "") {
            const user = yield userModel_1.default.findByIdAndUpdate(getUser === null || getUser === void 0 ? void 0 : getUser._id, {
                verifyToken: "",
                password: hashed,
            }, { new: true });
            return res
                .status(201)
                .json({ message: "created successfully", data: user, status: 201 });
        }
        else {
            return res.status(404).json({ message: "user can't be found" });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.resetUserPassword = resetUserPassword;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { userName, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const getUser = yield userModel_1.default.findById(userID);
        if (getUser) {
            const user = yield userModel_1.default.findByIdAndUpdate(userID, {
                userName,
                password: hashed,
            }, { new: true });
            return res
                .status(201)
                .json({ message: "User update successfully", data: user, status: 201 });
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
exports.updateUserPassword = updateUserPassword;
const updateUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const getUser = yield userModel_1.default.findById(userID);
        if (getUser) {
            let filePath = node_path_1.default.join(__dirname, "../uploads/avatar");
            const deleteFilesInFolder = (folderPath) => {
                if (node_fs_1.default.existsSync(folderPath)) {
                    const files = node_fs_1.default.readdirSync(folderPath);
                    files.forEach((file) => {
                        const filePath = node_path_1.default.join(folderPath, file);
                        node_fs_1.default.unlinkSync(filePath);
                    });
                    console.log(`All files in the folder '${folderPath}' have been deleted.`);
                }
                else {
                    console.log(`The folder '${folderPath}' does not exist.`);
                }
            };
            const { secure_url } = yield cloudinary_1.default.uploader.upload(req.file.path);
            const user = yield userModel_1.default.findByIdAndUpdate(userID, {
                avatar: secure_url,
            }, { new: true });
            deleteFilesInFolder(filePath);
            return res
                .status(201)
                .json({ message: "User update successfully", data: user, status: 201 });
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
exports.updateUserAvatar = updateUserAvatar;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { userName, bio, location } = req.body;
        const getUser = yield userModel_1.default.findById(userID);
        if (getUser) {
            const user = yield userModel_1.default.findByIdAndUpdate(userID, {
                userName,
                bio,
                location,
            }, { new: true });
            return res
                .status(201)
                .json({ message: "User update successfully", data: user, status: 201 });
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
exports.updateUserInfo = updateUserInfo;
