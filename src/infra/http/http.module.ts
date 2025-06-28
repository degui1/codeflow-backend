import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthUseCase } from 'src/domain/use-cases/auth.use-case';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { GetUserUseCase } from 'src/domain/use-cases/get-user.use-case';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuthController, UserController],
  providers: [AuthUseCase, GetUserUseCase],
})
export class HttpModule {}
