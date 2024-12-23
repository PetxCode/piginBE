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
exports.changePassword = exports.verifiedEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GOOGLE_ID = "848542784186-9os7noa7qvcg3nckfu38s3bhob8u6oga.apps.googleusercontent.com";
const GOOGLE_REFRESH = "1//04GgN8ydoI_ZdCgYIARAAGAQSNwF-L9IrKCOkFE95PncupZNTb3WCiygNcFb1vp20oW-1SMJTKzSWxnWw2B6nf4S85GXSTpgR44M";
const GOOGLE_SECRET = "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";
const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
// const GOOGLE_ID =
//   "505254584403-4no5d7rnsiviuqlgacnjam4o9aj4augo.apps.googleusercontent.com";
// const GOOGLE_REFRESH =
//   "1//047y0yS_MC4b2CgYIARAAGAQSNwF-L9Ir2XoVt4mILAG1js-I9n08muVasqy2bA3mbmV9Goa0CuXK14H-hyhGHhqRCEDMOZ_rrOI";
// const GOOGLE_SECRET = "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";
// const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
// const GOOGLE_ID = process.env.GOOGLE_ID;
// const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
// const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
// const GOOGLE_REFRESH = process.env.GOOGLE_REFRESH;
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });
const url = "http://localhost:5173";
// const url: string = "https://indobai.web.app";
const verifiedEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "codelabbest@gmail.com",
                clientSecret: GOOGLE_SECRET,
                clientId: GOOGLE_ID,
                refreshToken: GOOGLE_REFRESH,
                accessToken,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
        }, "secretCode", {
            expiresIn: "5m",
        });
        let frontEndURL = `${url}/${token}/auth/login-in`;
        let devURL = `${url}/auth/activate-account/${token}`;
        const myPath = path_1.default.join(__dirname, "../views/index.ejs");
        const html = yield ejs_1.default.renderFile(myPath, {
            link: devURL,
        });
        const mailerOption = {
            from: "PinginApp <codelabbest@gmail.com>",
            to: user.email,
            subject: "Account Verification",
            html,
        };
        yield transporter.sendMail(mailerOption).then(() => {
            console.log("email sent again!");
        });
    }
    catch (error) {
        console.error();
    }
});
exports.verifiedEmail = verifiedEmail;
const changePassword = (getUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "codelabbest@gmail.com",
                clientSecret: GOOGLE_SECRET,
                clientId: GOOGLE_ID,
                refreshToken: GOOGLE_REFRESH,
                accessToken,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: getUser._id,
            email: getUser.email,
        }, "secretCode", {
            expiresIn: "5m",
        });
        let devURL = `${url}/auth/reset-password/${token}`;
        const myPath = path_1.default.join(__dirname, "../views/resetPassword.ejs");
        const html = yield ejs_1.default.renderFile(myPath, {
            token: getUser.userName,
            link: devURL,
        });
        const mailerOption = {
            from: "PinginApp Restet Password <codelabbest@gmail.com>",
            to: getUser.email,
            subject: "Password reset Notification",
            html,
        };
        yield transporter.sendMail(mailerOption);
    }
    catch (error) {
        console.error();
    }
});
exports.changePassword = changePassword;
