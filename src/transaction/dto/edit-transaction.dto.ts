import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';

export class EditTransactionDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['expense', 'income'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  category?: string;
}
