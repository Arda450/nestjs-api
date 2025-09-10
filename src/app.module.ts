import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';

// a decorator is a function that adds metadata to the class
@Module({
  imports: [
    ConfigModule.forRoot({
      // setzt es auf global wie der @Global() Decorator
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    TransactionModule,
    CategoryModule,
    PrismaModule,
  ],
})
export class AppModule {}
