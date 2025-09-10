import {
  Controller,
  Get,
  UseGuards,
  Post,
  Delete,
  Patch,
  ParseIntPipe,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { TransactionService } from './transaction.service';
import { GetUser } from '../auth/decorator';
import { CreateTransactionDto, EditTransactionDto } from './dto';

@UseGuards(JwtGuard) // man muss angemeldet sein, um auf die transactions zugreifen zu können
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Get()
  getTransactions(@GetUser('id') userId: number) {
    return this.transactionService.getTransactions(userId);
  }

  @Get(':id')
  // We have to check if the transaction belongs to the user via id, hence the @GetUser('id')
  // id is by default a string, so we need to parse it to a number with ParseIntPipe
  getTransactionById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) transactionId: number,
  ) {
    return this.transactionService.getTransactionById(userId, transactionId);
  }

  @Post() //reagiert auf http post request
  createTransaction(
    @GetUser('id') userId: number, //get the user id from the jwt token
    @Body() dto: CreateTransactionDto, // extrahiert und validiert den request body
  ) {
    return this.transactionService.createTransaction(userId, dto); // service aufrufen
  }

  @Patch(':id')
  editTransactionById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) transactionId: number,
    @Body() dto: EditTransactionDto,
  ) {
    return this.transactionService.editTransactionById(
      userId,
      transactionId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  // id kommt aus der url, userId kommt aus dem jwt token
  @Delete(':id')
  deleteTransactionById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) transactionId: number,
  ) {
    return this.transactionService.deleteTransactionById(userId, transactionId);
  }
}
