import { Module } from '@nestjs/common';
import { UsersModule } from 'src/domain/users/users.module';
import { OAuthService } from './auth.service';
import { AuthController } from '../http/controllers/auth.controller';
import { PrismaService } from '../database/prisma.service';
import { CookieService } from './cookie.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [OAuthService, PrismaService, CookieService],
})
export class AuthModule {}
