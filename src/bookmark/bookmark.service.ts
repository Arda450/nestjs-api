import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  // dto wird nur benötigt, wenn daten von vom client zum server übertragen werden
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto, // destructuring dto, damit alle properties von dto in das bookmark objekt übernommen werden
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    // check if bookmark exists and if the user is the owner of the bookmark
    // it's a guard conditiion, so it's gonna stop the execution of the function
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');
    // if the user is the owner of the bookmark, update the bookmark
    return this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto }, // destructuring dto, damit alle properties von dto in das bookmark objekt übernommen werden
    });
  }

  // doesn't return anything, because it's a void function
  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // check if the user owns the bookmark
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    // check if bookmark exists and if the user is the owner of the bookmark
    // it's a guard conditiion, so it's gonna stop the execution of the function
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
