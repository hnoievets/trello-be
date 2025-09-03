import { Module } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { entities } from '../common/utils/database/entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature(entities), UsersModule],
  providers: [ProjectMembersService],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
