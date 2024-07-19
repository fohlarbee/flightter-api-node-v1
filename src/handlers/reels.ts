import { setValue } from "#/db/redis";
import CustomError from "#/lib/customError";
import { prisma } from "#/lib/prismaConnect";
import cloudUplaoder from "#/utils/cloudinaryUplaod";
import { RequestHandler } from "express";

export const uploadReel: RequestHandler = async (req, res) => {
  try {
    const url = await cloudUplaoder(req.file!, req.user.id);
    const reelDocs = {
      userId: req.user.id,
      title: req.body.title,
      videoUrl: url,
      caption: req.body.caption,
    };
    const newReel = await prisma.reel.create({
      data: { ...reelDocs },
    });
    await setValue(
      `reels/${req.user.id}/${req.body.title}/${req.file?.destination}/${req.file?.originalname}`,
      JSON.stringify(newReel),
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Reel uploaded successfully",
        data: { newReel },
      });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

export const fetchReels: RequestHandler = async (req, res) => {
  try {
    const page: any = req.query.page ? req.query.page : 1;
    const perPage: any = req.query.perPage ? req.query.perPage : 10;
    const skip = (page - 1) * perPage;
    const filter: any = req.query.filter;

    const where: any = { userId: req.user.id };
    if (filter?.title) {
      where.title = { contains: filter.title };
    }
    if (filter?.caption) {
      where.caption = { contains: filter.description };
    }

    const reels = await prisma.reel.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    });

    res.status(200).json({
      success: true,
      message: "Fetched Reels",
      data: { reels },
      pagination: {
        page,
        perPage,
        totalPages: Math.ceil(
          (await prisma.reel.count({ where: { userId: req.user.id } })) /
            perPage,
        ),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const fetchReel: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await prisma.reel.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    if (!reel)
      return res.status(404).json({ success: false, mssg: "Reel not found" });

    res
      .status(200)
      .json({ success: true, message: "Fetched Reel", data: { reel } });
  } catch (error) {}
};
export const updateReel: RequestHandler = async (req, res) => {
  try {
    const reel = await prisma.reel.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    if (!reel)
      return res.status(404).json({ success: false, mssg: "Reel not found" });

    if (reel?.userId !== req.user.id)
      return res
        .status(401)
        .json({ success: false, mssg: "You cant update this reel" });

    const updatedReel = await prisma.reel.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...req.body,
      },
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Reel updated successfully",
        data: { reel: updatedReel },
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
export const deleteReel: RequestHandler = async (req, res) => {
  try {
    const reel = await prisma.reel.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    if (!reel)
      return res
        .status(404)
        .json({ success: false, mssg: "Reel not found or has been deleted" });

    if (reel?.userId !== req.user.id)
      return res
        .status(401)
        .json({ success: false, mssg: "You cant delete this reel" });

    const deletedReel = await prisma.reel.delete({
      where: { id: parseInt(req.params.id) },
    });
    res
      .status(200)
      .json({
        success: true,
        message: "Reel deleted successfully",
        data: { deletedReel },
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const react: RequestHandler = async(req, res) => {

  try {
    const {id} = req.params
    const { reaction } = req.body;
    const reel = await prisma.reel.findFirst({
      where: { id: parseInt(id) },
    });
    if (!reel)
      throw new CustomError(false, 'Reel not found', null);

    const userReaction = await prisma.reaction.findFirst({
      where: { userId:req.user.id, reelId:reel?.id },
    });

    if (userReaction && userReaction.reaction === reaction) {
      await prisma.reaction.delete({
        where: { id: userReaction?.id, userId:req.user.id, reelId:+id },
      });
      return res.status(200).json({success:true, mssg:"Reel reaction removed"})
    } else {  
      await prisma.reaction.upsert({
        where: {id:userReaction?.id, userId:req.user.id, reelId:reel?.id },
        update: { reaction },
        create: { userId: req.user.id, reelId: parseInt(id), reaction }});

        return res.status(200).json({success:true, mssg:"Reel reaction created successfully"})
      }
    
    
  } catch (error) {
        if (error instanceof Error) {
        return res.status(403).json({ success: false, message: error.message });
      }

    
  }
 
          
}
