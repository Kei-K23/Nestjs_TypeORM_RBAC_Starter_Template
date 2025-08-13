import { User } from 'src/user/entities/user.entity';

export type AuthenticatedUser = Omit<User, 'password'>;

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

export interface JwtPayload {
  sub: number;
  userId: number;
  email: string;
  roleId?: number;
  iat?: number;
  exp?: number;
}
