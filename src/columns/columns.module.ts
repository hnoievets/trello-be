import { forwardRef, Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { entities } from '../common/utils/database/entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsModule } from '../projects/projects.module';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/utils/guards/guard.provider';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    SequelizeModule.forFeature(entities),
    SessionsModule,
    forwardRef(() => ProjectsModule),
    forwardRef(() => TasksModule),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService, JwtStrategy, ...guardProviders],
  exports: [ColumnsService],
})
export class ColumnsModule {}
