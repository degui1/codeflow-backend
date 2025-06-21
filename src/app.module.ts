import { Module } from '@nestjs/common';
import { PrismaService } from './infra/database/prisma.service';
import { AuthModule } from './infra/auth/auth.module';
import { UsersModule } from './domain/users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
