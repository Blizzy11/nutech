import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ServicesModel = {
  getServicesByCode: async (serviceCode: string) => {
    const service = await prisma.services.findFirst({
      where: {
        service_code: serviceCode,
      },
    });
    return service;
  },
};

export default ServicesModel;
