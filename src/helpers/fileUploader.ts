import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import config from "../config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads/"));
  },
  filename: function (req, file, cb) {
    const image_name = file.originalname.toString().split(" ").join("-");

    cb(null, image_name);
  },
});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: config.fileUpload.cloud_name,
  api_key: config.fileUpload.api_key,
  api_secret: config.fileUpload.api_secret,
});

const uploadToCloudinary = async (file: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { public_id: file.filename },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
