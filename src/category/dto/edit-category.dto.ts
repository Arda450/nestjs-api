import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { FinanceType } from '@prisma/client';

export class EditCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(FinanceType)
  @IsOptional()
  type?: FinanceType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
