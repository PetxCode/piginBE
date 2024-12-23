import nodemail from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import userModel from "../model/userModel";
env.config();

const GOOGLE_ID =
  "848542784186-9os7noa7qvcg3nckfu38s3bhob8u6oga.apps.googleusercontent.com";

const GOOGLE_REFRESH =
  "1//04GgN8ydoI_ZdCgYIARAAGAQSNwF-L9IrKCOkFE95PncupZNTb3WCiygNcFb1vp20oW-1SMJTKzSWxnWw2B6nf4S85GXSTpgR44M";

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

const oAuth = new google.auth.OAuth2(
  GOOGLE_ID,
  GOOGLE_SECRET,
  GOOGLE_REDIRECT_URL
);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });

const url: string = "http://localhost:5173";
// const url: string = "https://indobai.web.app";

export const verifiedEmail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
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

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "secretCode",
      {
        expiresIn: "5m",
      }
    );

    let frontEndURL: string = `${url}/${token}/auth/login-in`;

    let devURL: string = `${url}/auth/activate-account/${token}`;

    const myPath = path.join(__dirname, "../views/index.ejs");

    const html = await ejs.renderFile(myPath, {
      link: devURL,
    });

    const mailerOption = {
      from: "PinginApp <codelabbest@gmail.com>",
      to: user.email,
      subject: "Account Verification",
      html,
    };

    await transporter.sendMail(mailerOption).then(() => {
      console.log("email sent again!");
    });
  } catch (error) {
    console.error();
  }
};

export const changePassword = async (getUser: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
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

    const token = jwt.sign(
      {
        id: getUser._id,
        email: getUser.email,
      },
      "secretCode",
      {
        expiresIn: "5m",
      }
    );

    let devURL: string = `${url}/auth/reset-password/${token}`;

    const myPath = path.join(__dirname, "../views/resetPassword.ejs");

    const html = await ejs.renderFile(myPath, {
      token: getUser.userName,
      link: devURL,
    });

    const mailerOption = {
      from: "PinginApp Restet Password <codelabbest@gmail.com>",
      to: getUser.email,
      subject: "Password reset Notification",
      html,
    };

    await transporter.sendMail(mailerOption);
  } catch (error) {
    console.error();
  }
};
