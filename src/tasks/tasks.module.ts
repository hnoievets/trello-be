import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/utils/guards/guard.provider';
import { SessionsModule } from '../sessions/sessions.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { entities } from '../common/utils/database/entities';
import { ProjectsModule } from '../projects/projects.module';
import { ColumnsModule } from '../columns/columns.module';
import { FilesModule } from '../files/files.module';
import { TaskAttachmentsModule } from '../task-attachments/task-attachments.module';
import { TasksGateway } from './tasks.gateway';

@Module({
  imports: [
    SequelizeModule.forFeature(entities),
    SessionsModule,
    forwardRef(() => ProjectsModule),
    forwardRef(() => ColumnsModule),
    FilesModule,
    TaskAttachmentsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, JwtStrategy, ...guardProviders, TasksGateway],
  exports: [TasksService, TasksGateway],
})
export class TasksModule {}
