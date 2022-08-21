import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/users/user.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
