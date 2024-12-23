import { v2 as cloudinary } from "cloudinary";
import env from "dotenv";
env.config();

cloudinary.config({
  cloud_name: "dc6qdwcuc",
  api_key: "733374829358363",
  api_secret: "uJTv4yY-CXBFX2lX4Xa0dGE6dBk",
});

export default cloudinary;
