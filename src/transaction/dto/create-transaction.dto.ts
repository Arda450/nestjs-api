import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(['expense', 'income'])
  type: string;

  @IsString()
  @IsOptional()
  category?: string;
}
