import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/utils/guards/guard.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { entities } from '../common/utils/database/entities';
import { SessionsModule } from '../sessions/sessions.module';
import { ProjectMembersModule } from '../project-members/project-members.module';
import { ProjectsGateway } from './projects.gateway';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    SequelizeModule.forFeature(entities),
    SessionsModule,
    ProjectMembersModule,
    forwardRef(() => TasksModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtStrategy, ...guardProviders, ProjectsGateway],
  exports: [ProjectsService, ProjectsGateway],
})
export class ProjectsModule {}
