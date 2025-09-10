import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum FinanceType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FinanceType)
  type: FinanceType;
}
