import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateCategoryDto, EditCategoryDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { FinanceType } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // Alle Kategorien des Users holen
  getCategories(userId: number, type?: FinanceType, isActive?: boolean) {
    return this.prisma.category.findMany({
      where: {
        userId,
        ...(isActive !== undefined ? { isActive } : { isActive: true }),
        ...(type ? { type } : {}),
      },
      orderBy: {
        name: 'asc', // Alphabetisch sortiert
      },
    });
  }

  // Einzelne Kategorie holen
  getCategoryById(userId: number, categoryId: number) {
    return this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId, // Sicherheit: Nur eigene Kategorien
      },
    });
  }

  // Neue Kategorie erstellen
  async createCategory(userId: number, dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        userId,
        ...dto, // name, description, type
      },
    });
    return category;
  }

  // Kategorie bearbeiten
  async editCategoryById(
    userId: number,
    categoryId: number,
    dto: EditCategoryDto,
  ) {
    // Sicherheitscheck: Gehört die Kategorie dem User?
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category || category.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    // Update ausführen
    return this.prisma.category.update({
      where: { id: categoryId },
      data: { ...dto },
    });
  }

  // Kategorie löschen (Soft Delete - isActive auf false setzen)
  async deleteCategoryById(userId: number, categoryId: number) {
    // Sicherheitscheck
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category || category.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    // Soft Delete: isActive auf false setzen statt echtes Löschen
    // Dadurch bleiben die Transaktionen erhalten (onDelete: SetNull)
    await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        isActive: false,
      },
    });
  }
}
