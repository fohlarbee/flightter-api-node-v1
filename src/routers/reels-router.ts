import {
  deleteReel,
  fetchReel,
  fetchReels,
  react,
  updateReel,
  uploadReel,
} from "#/handlers/reels";
import { IsAuth } from "#/middlewares/isAuth";
import { reelReader } from "#/middlewares/multer";
import { validateUploadreel } from "#/middlewares/validateReelUpload";
import checkDuplicateReel from "#/utils/checkDuplicateReel";
import { Request, Response, Router } from "express";

export const reelRouter = Router();

reelRouter.use(IsAuth);

reelRouter.use(IsAuth);
reelRouter.post(
  "/",
  reelReader.single("reel"),
  checkDuplicateReel,
  validateUploadreel,
  uploadReel,
);
reelRouter.get("/", fetchReels);
reelRouter.get("/:id", fetchReel);
reelRouter.patch("/:id", updateReel);
reelRouter.delete("/:id", deleteReel);
reelRouter.post('/react/:id', react)
