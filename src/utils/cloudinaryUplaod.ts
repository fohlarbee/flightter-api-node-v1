import { resolve } from "path";
import cloudinary from "./cloudinaryConfig";
import fs from "fs";

interface fileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  path: string;
}

const cloudUplaoder = async (file: fileData, id: string) => {
  const randomCode = Math.floor(Math.random() * 10000);

  const resource = await cloudinary.uploader.upload(file.path, {
    resource_type: "video",
    chunk_size: 6000000,
    public_id: `${file.fieldname}/${id}/${randomCode}`,
    folder: "reels",
  });
  return resource.secure_url;
};

export default cloudUplaoder;
