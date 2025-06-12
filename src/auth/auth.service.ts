import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, ChangePasswordDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
// business logic here
@Injectable()
// dependency injection to use the PrismaService
export class AuthService {
  // In-Memory Token-Blacklist (für Produktionsumgebungen sollte Redis verwendet werden)
  private tokenBlacklist: Set<string> = new Set();

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    // damit man die .env datei auslesen kann muss man config service importieren
    private config: ConfigService,
  ) {}

  // ####################################################################

  // dto enthält validierte daten von auth.controller (AuthDto)
  async signup(dto: AuthDto) {
    // generate the password hash, await nötig, weil hashen zeit braucht
    // await wartet auf db antwort
    const hash = await argon.hash(dto.password);

    try {
      // then save the new user in the database
      const user = await this.prisma.user.create({
        // prisma führt db operation aus, INSERT INTO users ... etc.
        data: {
          email: dto.email, // validierte email aus dto
          hash, // hash aus dto
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      // instanceof prüft ob error vom typ PrismaClientKnownRequestError ist
      // ermöglicht spezifische fehlermeldungen zu geben
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      // fängt unbekannte fehler ab, verhindert stille fehler, ermöglicht logging/debugging
      throw error;
    }
  }

  // ####################################################################

  async signin(dto: AuthDto) {
    // find the user by email
    // prisma holt den user aus der db und speichert ihn in user variable
    const user = await this.prisma.user.findUnique({
      where: {
        // email aus dto wird mit email aus db verglichen
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // falls user existiert, vergleiche password
    // 1. argument: hash from db, 2. argument: password from request
    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if pasword is incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }

  // ####################################################################

  // promise gibt einen string zurück
  // diese funktion erstellt ein JWT (JSON Web Token) wenn man sich einloggt z.B.
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    // erstellt ein payload objekt mit user id und email
    const payload = {
      // sub is jwt convention for user id
      sub: userId,
      email,
    };

    // holt den geheimen schlüssel aus der .env datei (JWT_SECRET)
    const secret = this.config.get('JWT_SECRET');
    // signAsync comes from jwt service
    //this.jwt.signAsync returns a promise<string>
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m', // 15 minutes
      secret: secret,
    });
    // Der Token wird für Authentifizierung bei weiteren requests verwendet
    // Für das Speichern der User-id
    // Für die Zugriffskontrolle auf geschützte routes

    return {
      access_token: token,
    };
  }

  // ####################################################################

  async changePassword(userId: number, dto: ChangePasswordDto) {
    // Check if new password and confirm password match
    if (dto.newPassword !== dto.confirmPassword) {
      throw new ForbiddenException(
        'New password and confirm password do not match',
      );
    }

    // find the user by id
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('User not found');

    // verify old password
    const oldPwMatches = await argon.verify(user.hash, dto.oldPassword);

    if (!oldPwMatches) throw new ForbiddenException('Old password incorrect');

    // generate new password hash
    const newHash = await argon.hash(dto.newPassword);

    // update user with new password
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hash: newHash,
      },
    });

    return { message: 'Password changed successfully' };
  }

  // ####################################################################
}
