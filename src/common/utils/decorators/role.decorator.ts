import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../resources/users';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
