import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthUseCase } from 'src/domain/use-cases/auth/auth.use-case';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { EnvModule } from '../env/env.module';
import { GetUserUseCase } from 'src/domain/use-cases/current-user/get-current-user.use-case';
import { DeleteUserUseCase } from 'src/domain/use-cases/current-user/delete-current-user.use-case';
import { MeController } from './controllers/me.controller';
import { CommunityController } from './controllers/community.controller';
import { GetProfilePostHistoryUseCase } from 'src/domain/use-cases/profile/get-profile-post-history.use-case';
import { GetUserPostHistoryUseCase } from 'src/domain/use-cases/current-user/get-current-user-post-history.use-case';
import { GetCommunityPostsUseCase } from 'src/domain/use-cases/community/get-community-posts.use-case';
import { FlowSchemasController } from './controllers/flowSchema.controller';
import { GetAvailableFlowSchemas } from 'src/domain/use-cases/flow/get-available-flow-schemas.use-case';
import { LogoutUseCase } from 'src/domain/use-cases/auth/logout.use-case';
import { GetUserSummaryUseCase } from 'src/domain/use-cases/current-user/get-current-user-summar.use-case';
import { PostsController } from './controllers/posts.controller';
import { CreatePostsUseCase } from 'src/domain/use-cases/post/create-post.use-case';
import { UpdatePostsUseCase } from 'src/domain/use-cases/post/update-post.use-case';
import { DeletePostsUseCase } from 'src/domain/use-cases/post/delete-post.use-case';
import { IncreaseDownloadPostUseCase } from 'src/domain/use-cases/post/increase-download-post.use-case';

@Module({
  imports: [DatabaseModule, AuthModule, EnvModule],
  controllers: [
    AuthController,
    UserController,
    MeController,
    CommunityController,
    FlowSchemasController,
    PostsController,
  ],
  providers: [
    AuthUseCase,
    GetUserUseCase,
    DeleteUserUseCase,
    GetProfilePostHistoryUseCase,
    GetUserPostHistoryUseCase,
    GetCommunityPostsUseCase,
    GetAvailableFlowSchemas,
    LogoutUseCase,
    GetUserSummaryUseCase,
    CreatePostsUseCase,
    UpdatePostsUseCase,
    DeletePostsUseCase,
    IncreaseDownloadPostUseCase,
  ],
})
export class HttpModule {}
