import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { ExampleController } from './controllers/example.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [],
  providers: [ExampleController],
})
export class GatewayModule {}
