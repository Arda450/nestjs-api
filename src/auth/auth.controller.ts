import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ChangePasswordDto } from './dto';
import { JwtGuard } from './guard';
import { GetUser } from './decorator';
// @Controller('auth'), so nestJS knows this is a controller
// controller calls the service
// service is a class that contains the logic
// controller is a class that contains the routes
// here are the API endpoints located
@Controller('auth')
export class AuthController {
  // instance of the AuthService class to use its methods
  // instead of using this.authService = authService, we just use private
  constructor(private authService: AuthService) {}

  // defining endpoints

  // @Req injiziert das Request-Objekt. req ist der Parameter und Request ist der ExpressJS typ
  @Post('signup')
  // @Body decorator extrahiert Request-Body
  // AuthDto definiert die Struktur, also nur email und password sind erlaubt
  signup(@Body() dto: AuthDto) {
    // weiterleitung an Service mit validierten (dto) daten aus dem Request-Body
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  // die signin func im controller ist nicht dieselbe signin func wie im service
  // die signin func im controller ist eine andere funktion
  // signin im controller returned die signin func vom auth.service.ts
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('change-password')
  changePassword(
    @GetUser('id') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }
}
