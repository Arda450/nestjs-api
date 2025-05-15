import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// hier befindet sich der datenbankzugriff
// by adding the global decorator, the prisma service is available in all modules
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
