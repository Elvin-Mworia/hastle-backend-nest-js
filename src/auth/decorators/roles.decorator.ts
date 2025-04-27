import { SetMetadata } from '@nestjs/common';
import { UserCategory } from '../../users/schemas/user.schema';

export const ROLES_KEY = 'roles';

/**
 * Decorator that assigns roles to a route or controller
 * @param roles - The roles that are allowed to access the route
 * @returns A decorator function
 */
export const Roles = (...roles: UserCategory[]) => SetMetadata(ROLES_KEY, roles);

