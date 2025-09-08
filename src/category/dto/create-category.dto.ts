import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string; // Hex color

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsIn(['expense', 'income'])
  type: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[]; // Keywords für Smart Categorization
}
