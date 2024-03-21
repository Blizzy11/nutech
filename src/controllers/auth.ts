import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import Helper from "../helper/utils";
import JWT from "../middlewares/jwt.middlewares";
const prisma = new PrismaClient();

const AuthController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check is invalid email
    if (!Helper.isValidEmail(email)) {
      return res.status(400).json({
        status: 102,
        message: "Parameter email tidak sesuai format",
        data: null,
      });
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        status: 102,
        message: "email tidak terdaftar",
        data: null,
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ status: 103, message: "Password salah", data: null });
    }

    // set up jwt
    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    const token = JWT.signToken(payload, "1h");

    return res.status(200).json({
      status: 200,
      message: "Login success",
      data: {
        token,
      },
    });
  },
};

export default AuthController;
