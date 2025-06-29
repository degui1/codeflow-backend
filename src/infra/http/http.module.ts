import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthUseCase } from 'src/domain/use-cases/auth/auth.use-case';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { GetUserUseCase } from 'src/domain/use-cases/current-user/get-current-user.use-case';
import { DeleteUserUseCase } from 'src/domain/use-cases/current-user/delete-current-user.use-case';
import { MeController } from './controllers/me.controller';
import { CommunityController } from './controllers/community.controller';
import { GetProfilePostHistoryUseCase } from 'src/domain/use-cases/profile/get-profile-post-history.use-case';
import { GetUserPostHistoryUseCase } from 'src/domain/use-cases/current-user/get-current-user-post-history.use-case';
import { GetCommunityPostsUseCase } from 'src/domain/use-cases/community/get-community-posts.use-case';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    AuthController,
    UserController,
    MeController,
    CommunityController,
  ],
  providers: [
    AuthUseCase,
    GetUserUseCase,
    DeleteUserUseCase,
    GetProfilePostHistoryUseCase,
    GetUserPostHistoryUseCase,
    GetCommunityPostsUseCase,
  ],
})
export class HttpModule {}
