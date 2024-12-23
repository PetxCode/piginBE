import multer from "multer";

import path from "node:path";
import fs from "node:fs";

let folder = path.join(__dirname, "../uploads");

if (!fs.existsSync(folder)) {
  fs.mkdir(folder, () => {
    console.log("created");
  });
}

// export const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       let folder = "./uploads/others";

//       // if (file.fieldname === "gallaryImage") folder = "./uploads/photos";

//       if (file.fieldname === "coverImage") folder = "./uploads/coverImages";
//       else if (file.fieldname === "map") folder = "./uploads/maps";
//       else if (file.fieldname === "brochure") folder = "./uploads/documents";
//       else if (file.fieldname === "gallaryImage") folder = "./uploads/photos";
//       cb(null, folder);
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.fieldname}-${file.originalname}`);
//     },
//   }),
// });

// export const avatar = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       let folder = "./uploads/others";

//       if (file.fieldname === "gallaryImage") folder = "./uploads/photos";

//       cb(null, folder);
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.fieldname}-${file.originalname}`);
//     },
//   }),
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/avatar");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
//   },
// });

// export const uploadAvatar = multer({ storage: storage }).single("avatar");

const storageAvatar = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, folder);
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

export const uploadAvatarImage = multer({ storage: storageAvatar }).single(
  "avatar"
);
