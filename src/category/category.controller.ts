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
  Query,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CategoryService } from './category.service';
import { GetUser } from '../auth/decorator';
import { CreateCategoryDto, EditCategoryDto } from './dto';
import { FinanceType } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories(
    @GetUser('id') userId: number,
    @Query('type') type?: FinanceType,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBoolean =
      isActive !== undefined ? isActive === 'true' : undefined;
    return this.categoryService.getCategories(userId, type, isActiveBoolean);
  }

  @Get(':id')
  // We have to check if the category belongs to the user via id, hence the @GetUser('id')
  // id is by default a string, so we need to parse it to a number with ParseIntPipe
  getCategoryById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.getCategoryById(userId, categoryId);
  }

  @Post() // reagiert auf http post request
  createCategory(
    @GetUser('id') userId: number, // get the user id from the jwt token
    @Body() dto: CreateCategoryDto, // extrahiert und validiert den request body
  ) {
    return this.categoryService.createCategory(userId, dto); // service aufrufen
  }

  @Patch(':id')
  editCategoryById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() dto: EditCategoryDto,
  ) {
    return this.categoryService.editCategoryById(userId, categoryId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  // id kommt aus der url, userId kommt aus dem jwt token
  @Delete(':id')
  deleteCategoryById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.deleteCategoryById(userId, categoryId);
  }
}
