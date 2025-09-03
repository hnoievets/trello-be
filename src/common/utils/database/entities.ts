import { User } from 'src/users/entities';
import { VerificationToken } from 'src/verification-tokens/entities';
import { Project } from 'src/projects/entities';
import { Model, Repository } from 'sequelize-typescript';
import { ColumnModel } from 'src/columns/entities';
import { Task } from 'src/tasks/entities';
import { ProjectMember } from 'src/project-members/entities';
import { Comment } from 'src/comments/entities';
import { File } from '../../../files/entities';
import { TaskAttachment } from '../../../task-attachments/entities';

export const entities: Repository<Model>[] = [
  User,
  VerificationToken,
  Project,
  ProjectMember,
  Task,
  ColumnModel,
  Comment,
  File,
  TaskAttachment,
];
