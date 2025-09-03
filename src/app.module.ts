import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { ConfigModule } from './common/utils/config/config.module';
import { jwtModuleInstance } from './common/utils/jwt/jwt.module';
import { redisModuleInstance } from './common/utils/database/redis.provider';
import { sequelizeProvider } from './common/utils/database/database.provider';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { ColumnsModule } from './columns/columns.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { CommentsModule } from './comments/comments.module';
import { FilesModule } from './files/files.module';
import { RootTranslatorModule } from './common/utils/translator/translator.module';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    sequelizeProvider,
    RootTranslatorModule,
    UsersModule,
    SessionsModule,
    ProjectsModule,
    TasksModule,
    ColumnsModule,
    ProjectMembersModule,
    CommentsModule,
    FilesModule,
  ],
})
export class AppModule {}
