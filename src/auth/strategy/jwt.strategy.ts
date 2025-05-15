import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

// this file isfor validating the jwt token
// we can protect routes with this strategy
// Die Strategy ermöglicht es, geschützte Routen zu definieren, die nur mit gültigem Token zugänglich sind.

@Injectable() // markiert die Klasse als Injectable
// 'jwt' ist der name der strategy
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      //
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET') || 'fallback-secret',
    });
  }

  // validate the payload of the jwt token
  // whatever is shown in the payload, will be appended to the request object (user object)
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) throw new Error('User not found');
    const { hash, ...userWithoutHash } = user;

    return userWithoutHash;
  }
}
