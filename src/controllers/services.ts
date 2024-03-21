import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ServicesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const services = await prisma.services.findMany();
      return res.status(200).json({
        status: 200,
        message: "Success",
        data: services,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error getting services" });
    }
  },
};

export default ServicesController;
