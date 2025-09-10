import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
