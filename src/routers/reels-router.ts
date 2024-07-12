import { uploadReel } from "#/handlers/reels";
import { IsAuth } from "#/middlewares/isAuth";
import { reelReader } from "#/middlewares/multer";
import { validateUploadreel } from "#/middlewares/validateReelUpload";
import checkDuplicateReel from "#/utils/checkDuplicateReel";
import { Request, Response, Router } from "express";

export const reelRouter = Router();

reelRouter.use(IsAuth);
reelRouter.post('/',  
reelReader.single('reel'),
checkDuplicateReel,
validateUploadreel, 
uploadReel);