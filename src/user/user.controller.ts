import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
// every route in this controller requires authentication (token)
@UseGuards(JwtGuard) // custom guard
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  // what kind of guard? -> jwt
  // so this route is protected by the 'jwt' strategy
  @Get('me')
  getMe(@GetUser() user: User) {
    // user is of type User, comes from prisma client
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
