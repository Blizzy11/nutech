import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BannersController = {
  getAllBanners: async (req: Request, res: Response) => {
    const banners = await prisma.banners.findMany();
    return res.status(200).json({
      status: 200,
      message: "Success",
      data: banners,
    });
  },
};

export default BannersController;
