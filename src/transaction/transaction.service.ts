import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateTransactionDto, EditTransactionDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  // dto wird nur benötigt, wenn daten von vom client zum server übertragen werden
  getTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true, // ← Kategorie-Details immer mit laden
      },
      orderBy: {
        date: 'desc', // Neueste zuerst
      },
    });
  }

  getTransactionById(userId: number, transactionId: number) {
    return this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  // INSERT INTO transactions (userId, amount, description, categoryId, createdAt, updatedAt)
  // VALUES (123, 25.50, 'Mittagessen im Restaurant', 3, NOW(), NOW())
  // RETURNING *;

  async createTransaction(userId: number, dto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      // db insert
      data: {
        userId,
        ...dto, // destructuring dto, damit alle properties von dto in das transaction objekt übernommen werden
      },
      include: {
        category: true,
      },
    });
    return transaction; //  gibt die erstellte transaction zurück
  }

  async editTransactionById(
    userId: number,
    transactionId: number,
    dto: EditTransactionDto,
  ) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
    // check if transaction exists and if the user is the owner of the transaction
    // it's a guard conditiion, so it's gonna stop the execution of the function
    if (!transaction || transaction.userId !== userId)
      throw new ForbiddenException('Access to resources denied');
    // if the user is the owner of the transaction, update the transaction
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { ...dto }, // destructuring dto, damit alle properties von dto in das transaction objekt übernommen werden
    });
  }

  // doesn't return anything, because it's a void function
  async deleteTransactionById(userId: number, transactionId: number) {
    // check if the user owns the transaction
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
    // check if transaction exists and if the user is the owner of the transaction
    // it's a guard conditiion, so it's gonna stop the execution of the function
    if (!transaction || transaction.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });
  }
}
