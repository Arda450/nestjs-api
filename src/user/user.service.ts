import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    // extract hash from user object and put everything else into userWithoutHash and return it
    const { hash, ...userWithoutHash } = user;
    void hash; // Variable als verwendet markieren

    return userWithoutHash;
  }
}
