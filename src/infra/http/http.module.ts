import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './controllers/auth.controller';
import { AuthUseCase } from 'src/domain/use-cases/auth.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuthController],
  providers: [AuthUseCase],
})
export class HttpModule {}
