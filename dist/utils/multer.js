"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatarImage = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
let folder = node_path_1.default.join(__dirname, "../uploads");
if (!node_fs_1.default.existsSync(folder)) {
    node_fs_1.default.mkdir(folder, () => {
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
const storageAvatar = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
    },
});
exports.uploadAvatarImage = (0, multer_1.default)({ storage: storageAvatar }).single("avatar");
