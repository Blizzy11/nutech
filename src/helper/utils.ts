import jwt from "jsonwebtoken";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import TransactionsModel from "../models/transactionsModel";
import { Response } from "express";

const prisma = new PrismaClient();

export type getTransaction = {
  id: string;
  invoice_number: string;
  service_code: string;
  service_name: string;
  transaction_type: string;
  total_amount: number;
  createdAt: Date;
  updatedAt?: Date | null;
}[];

const Helper = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  getUserIdFromToken: (token: string): string => {
    const isToken = token.split(" ")[1];
    const isUserId = jwt.verify(
      isToken,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;
    return isUserId["id"];
  },

  upload: multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads/");
      },
      filename: (req, file, cb) => {
        cb(
          null,
          new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
        );
      },
    }),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return;
      }
    },
    // max file size 2mb
    limits: { fileSize: 2 * 1024 * 1024 },
  }),

  generateInvoiceNumber: (getTransaction: getTransaction) => {
    const isTransaction = getTransaction;
    const today = new Date();
    const year = today.getFullYear().toString().substr(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    if (getTransaction.length === 0) {
      return `INV${day}${month}${year}-0001`;
    } else {
      const lastInvoice = getTransaction[0].invoice_number;
      const splitInvoice = lastInvoice.split("-");

      // increment 0001
      const newInvoice = parseInt(splitInvoice[1]) + 1;
      const newInvoiceNumber = newInvoice.toString().padStart(4, "0");
      return `INV${day}${month}${year}-${newInvoiceNumber}`;
    }
  },
};

export default Helper;
