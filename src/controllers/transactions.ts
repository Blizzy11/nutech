import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Helper from "../helper/utils";
import usersModels from "../models/usersModel";
import ServicesModel from "../models/servicesModel";
import TransactionsModel from "../models/transactionsModel";
import { RequestTransaction } from "../types/transactionsType";

const prisma = new PrismaClient();

const TransactionsController = {
  topUp: async (req: Request, res: Response) => {
    const { top_up_amount } = req.body;
    const jwtToken = req.headers["authorization"];
    const isUserId = Helper.getUserIdFromToken(jwtToken!);

    if (!isUserId) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // check if amount is invalid
    if (top_up_amount < 1) {
      return res.status(400).json({
        status: 102,
        message:
          "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        data: null,
      });
    }

    try {
      const topUp = await usersModels.topUpUser(
        isUserId,
        parseFloat(top_up_amount)
      );
      return res.status(200).json({
        status: 200,
        message: "Top Up Balance berhasil",
        data: {
          balance: topUp.balance,
        },
      });
    } catch (error) {
      return res.status(400).json({ message: "Error top up user" });
    }
  },

  transaction: async (req: Request, res: Response) => {
    const { service_code } = req.body;
    const jwtToken = req.headers["authorization"];
    const isUserId = Helper.getUserIdFromToken(jwtToken!);

    if (!isUserId) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // check service code if exists
    const service = await ServicesModel.getServicesByCode(service_code);
    if (!service) {
      return res.status(400).json({
        status: 102,
        message: "Service ataus Layanan tidak ditemukan",
        data: null,
      });
    }

    // check if balance is enough
    const user = await usersModels.getUserByid(isUserId);

    if (user?.balance! < service.service_tarif) {
      return res
        .status(400)
        .json({ status: 102, message: "Saldo anda tidak cukup", data: null });
    }

    // create inv number INV21032024-001
    // get transaction history fisrt
    const getTransaction = await prisma.transactions.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
          lt: new Date(new Date().setHours(23, 59, 59)),
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const generateInvNumber = Helper.generateInvoiceNumber(getTransaction);
    const data: RequestTransaction = {
      invoice_number: generateInvNumber,
      service_code: service.service_code,
      service_name: service.service_name,
      transaction_type: "PAYMENT",
      total_amount: service.service_tarif,
      createdBY: isUserId,
      createdAt: new Date(),
    };

    // save transaction
    try {
      return TransactionsModel.saveTransactions(data, res);
    } catch (error) {
      return res.status(400).json({ message: "Error creating transaction" });
    }
  },

  // transaction history with pagination
  transactionHistory: async (req: Request, res: Response) => {
    const jwtToken = req.headers["authorization"];
    const isUserId = Helper.getUserIdFromToken(jwtToken!);

    if (!isUserId) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const { page, limit } = req.query;
    const currentPage = parseInt(page as string);
    const currentLimit = parseInt(limit as string);

    const offset = (currentPage - 1) * currentLimit;

    const transactionHistory = await prisma.transactions.findMany({
      select: {
        invoice_number: true,
        service_name: true,
        transaction_type: true,
        total_amount: true,
        createdAt: true,
      },
      where: {
        createdBy: isUserId,
      },
      orderBy: {
        id: "desc",
      },
      take: currentLimit ? currentLimit : undefined, // Use currentLimit if defined, otherwise undefined
      skip: currentLimit && currentLimit > 0 ? offset : undefined,
    });

    return res.status(200).json({
      status: 200,
      message: "Transaction history",
      data: transactionHistory,
    });
  },
};

export default TransactionsController;
