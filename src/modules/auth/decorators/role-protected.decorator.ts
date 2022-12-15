import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (
  ...args: ValidRoles[]
): CustomDecorator<string> => {
  return SetMetadata(META_ROLES, args);
};
