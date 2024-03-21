import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export interface CustomRequest extends Request {
  userId?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
}

const secret = process.env.JWT_SECRET!;

const JWT = {
  signToken: (payload: any, expiresIn: string) => {
    return jwt.sign(payload, secret, { expiresIn });
  },

  verifyToken: (req: CustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        status: 401,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null,
      });
    }
    const tokenValue = authorization.split(" ")[1];
    jwt.verify(tokenValue, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          message: "Token tidak tidak valid atau kadaluwarsa",
          data: null,
        });
      }
      const { userId, email, first_name, last_name } = decoded as CustomRequest;
      req.userId = userId;
      req.email = email;
      req.first_name = first_name;
      req.last_name = last_name;
      next();
    });
  },
};

export default JWT;
