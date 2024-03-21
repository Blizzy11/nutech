import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const usersModels = {
  saveUsers: async (req: Request, res: Response) => {
    const { email, first_name, last_name, password } = req.body;
    const hashPassword: string = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashPassword,
      },
    });
    return res
      .json({
        status: 0,
        message: "Registrasi berhasil silahkan login",
        data: null,
      })
      .status(200);
  },

  getUsersByEmail: async (email: string) => {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    return user;
  },

  getUserByid: async (id: string) => {
    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  },

  updateUserByid: async (id: string, req: Request) => {
    const { email, first_name, last_name } = req.body;
    const user = await prisma.users.update({
      select: {
        email: true,
        first_name: true,
        last_name: true,
        profile_image: true,
      },
      where: {
        id,
      },
      data: {
        email,
        first_name,
        last_name,
      },
    });
    return user;
  },

  updateUserImageByid: async (id: string, filename: string) => {
    const user = await prisma.users.update({
      select: {
        email: true,
        first_name: true,
        last_name: true,
        profile_image: true,
      },
      where: {
        id,
      },
      data: {
        profile_image: filename,
      },
    });
    return user;
  },

  topUpUser: async (id: string, amount: number) => {
    const user = await prisma.users.update({
      where: {
        id,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
    return user;
  },
};

export default usersModels;
