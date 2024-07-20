import { NextFunction, Request } from "express";
import multer, { FileFilterCallback, StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({});
const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (!file.mimetype.startsWith("video")) {
    cb(null, false);
  }
  cb(null, true);
};
export const reelReader = multer({ storage, fileFilter, limits });
