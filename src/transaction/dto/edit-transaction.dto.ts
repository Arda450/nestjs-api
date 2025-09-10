import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class EditTransactionDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
