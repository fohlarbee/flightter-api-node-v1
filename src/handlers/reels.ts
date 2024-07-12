import { getValue, setValue } from "#/db/redis";
import { prisma } from "#/lib/prismaConnect";
import cloudUplaoder from "#/utils/cloudinaryUplaod";
import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";

export const uploadReel:RequestHandler = async(req, res) => {

    try{
       const url = await cloudUplaoder(req.file!, req.user.id);
        let reelDocs = {
            userId: req.user.id,
            title:req.body.title,
            videoUrl: url,
            caption: req.body.caption,
        }

        // const reelExits = await getValue(`reels/${req.user.id}/${req.body.title}/${url}`);


        // const reelExists = await prisma.reel.findFirst({
        //     where:{
        //         videoUrl:{equals:url}
        //     }
        // });
        
        // if(reelExits) return res.status(409).json({status:false, data:{reelExits}});





        const newReel = await prisma.reel.create({
            data:{...reelDocs},
            
        })
        const cachedDta = await setValue(`reels/${req.user.id}/${req.body.title}/${req.file?.destination}/${req.file?.originalname}`, JSON.stringify(newReel));


        res.status(200).json({success: true, message: 'Reel uploaded successfully', data: {newReel}})
        

    }catch(err){
        if(err instanceof Error){
        res.status(500).json({success: false, message:err.message})


        }
    }

}