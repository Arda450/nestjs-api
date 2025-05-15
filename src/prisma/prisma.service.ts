import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

// here comes the database connection and the logic
// marks the class as a provider
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    // super is used to call the constructor of the parent class
    // in this case the PrismaClient
    super({
      // Ruft Constructor von PrismaClient auf
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
    console.log(config.get('DATABASE_URL'));
  }

  // dient dazu, die Datenbank für die Tests zu bereinigen
  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
