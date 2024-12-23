"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const mainError_1 = require("./error/mainError");
const handleError_1 = require("./error/handleError");
const enums_1 = require("./utils/enums");
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const friendRouter_1 = __importDefault(require("./router/friendRouter"));
const wordRouter_1 = __importDefault(require("./router/wordRouter"));
const meaningRouter_1 = __importDefault(require("./router/meaningRouter"));
const mainApp = (app) => {
    try {
        app.use(express_1.default.json());
        app.use("/api", userRouter_1.default);
        app.use("/api", friendRouter_1.default);
        app.use("/api", wordRouter_1.default);
        app.use("/api", meaningRouter_1.default);
        app.get("/", (req, res) => {
            try {
                return res.status(200).json({
                    message: "Welcome to pigin API v1",
                });
            }
            catch (error) {
                res.status(404).json({
                    message: "Error loading",
                });
            }
        });
        app.all("*", (req, res, next) => {
            next(new mainError_1.mainError({
                name: `Route Error`,
                message: `Route Error: because the page, ${req.originalUrl} doesn't exist`,
                status: enums_1.HTTP.BAD_REQUEST,
                success: false,
            }));
        });
        app.use(handleError_1.handleError);
    }
    catch (error) {
        return error;
    }
};
exports.mainApp = mainApp;
