import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class EditCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsIn(['expense', 'income'])
  @IsOptional()
  type?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
