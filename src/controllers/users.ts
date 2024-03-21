import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import usersModels from "../models/usersModel";
import Helper from "../helper/utils";

const prisma = new PrismaClient();

const Controller = {
  create: async (req: Request, res: Response) => {
    const { email } = req.body;

    // check if email already exists
    const emailExists = await usersModels.getUsersByEmail(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // check if email is invalid
    if (!Helper.isValidEmail(email)) {
      return res.status(400).json({
        status: 102,
        message: "Paramter email tidak sesuai format",
        data: null,
      });
    }

    try {
      const user = await usersModels.saveUsers(req, res);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error creating user" });
    }
  },

  // get profile self user using jwt token
  profile: async (req: Request, res: Response) => {
    const token = req.headers["authorization"];
    const id = Helper.getUserIdFromToken(token!);
    try {
      const user = await usersModels.getUserByid(id!);
      return res.status(200).json({
        status: 200,
        message: "Success",
        data: {
          email: user?.email,
          first_name: user?.first_name,
          last_name: user?.last_name,
          profile_image: user?.profile_image,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error getting user" });
    }
  },

  // update profile self user using jwt token
  updateProfile: async (req: Request, res: Response) => {
    const token = req.headers["authorization"];
    const id = Helper.getUserIdFromToken(token!);
    try {
      const user = await usersModels.updateUserByid(id!, req);
      return res.status(200).json({
        status: 200,
        message: "Update Pofile berhasil",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error updating user" });
    }
  },

  // update image profile self user using jwt token
  updateImageProfile: async (req: Request, res: Response) => {
    const token = req.headers["authorization"];
    const id = Helper.getUserIdFromToken(token!);

    // check if file is empty
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // check if file is not image
    if (
      req.file.mimetype !== "image/png" &&
      req.file.mimetype !== "image/jpg" &&
      req.file.mimetype !== "image/jpeg"
    ) {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai",
        data: null,
      });
    }

    // file name with url
    const fileUrl =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

    try {
      const user = await usersModels.updateUserImageByid(id!, fileUrl);
      return res.status(200).json({
        status: 200,
        message: "Update Profile Image berhasil",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error updating user" });
    }
  },

  getUserBalance: async (req: Request, res: Response) => {
    const token = req.headers["authorization"];
    const id = Helper.getUserIdFromToken(token!);
    try {
      const user = await usersModels.getUserByid(id!);
      return res.status(200).json({
        status: 200,
        message: "Get Balance Berhasil",
        data: {
          balance: user?.balance,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error getting user" });
    }
  },
};

export default Controller;
