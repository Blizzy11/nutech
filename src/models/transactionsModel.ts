import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestTransaction } from "../types/transactionsType";

const prisma = new PrismaClient();

const TransactionsModel = {
  saveTransactions: async (data: RequestTransaction, res: Response) => {
    const transaction = await prisma.transactions.create({
      data: {
        invoice_number: data.invoice_number,
        service_code: data.service_code,
        service_name: data.service_name,
        transaction_type: data.transaction_type,
        total_amount: data.total_amount,
        createdBy: data.createdBY,
        createdAt: data.createdAt,
      },
    });
    return res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: transaction,
    });
  },
};

export default TransactionsModel;
