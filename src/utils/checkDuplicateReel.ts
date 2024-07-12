import { getValue } from "#/db/redis";
import { RequestHandler } from "express";

const checkDuplicateReel: RequestHandler = async(req, res, next) => {

    try {
    const reelExits = await getValue(`reels/${req.user.id}/${req.body.title}/${req.file?.destination}/${req.file?.originalname}`);
    if (reelExits) {
        return res.status(409).json({ success: false, message: 'Reel already exists', data:{reelExits} });
    }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error checking duplicate reels' });
        
    }
    next();
}

export default checkDuplicateReel;