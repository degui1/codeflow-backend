import { Module } from '@nestjs/common';
import { UsersModule } from 'src/domain/users/users.module';
import { OAuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [OAuthService, PrismaService],
})
export class AuthModule {}
