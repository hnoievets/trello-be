import { Request } from 'express';
import { UserSessionDto } from '../../sessions/dto';

export type AuthRequest = Request & {user: UserSessionDto};

