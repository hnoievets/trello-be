import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { entities } from '../common/utils/database/entities';
import { SessionsModule } from '../sessions/sessions.module';
import { ProjectsModule } from '../projects/projects.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/utils/guards/guard.provider';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    SequelizeModule.forFeature(entities),
    SessionsModule,
    ProjectsModule,
    TasksModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, JwtStrategy, ...guardProviders],
  exports: [CommentsService],
})
export class CommentsModule {}
