/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserCategory } from '../../users/schemas/user.schema';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  /**
   * Determines if the current user can access the route
   * @param context The execution context
   * @returns A boolean indicating if the user has access
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First ensure the user is authenticated using JwtAuthGuard
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // Get the required roles from the route handler metadata
    const requiredRoles = this['reflector'].getAllAndOverride<UserCategory[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the user from the request object (set by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    
    // Check if the user's category is in the required roles
    const hasRequiredRole = requiredRoles.some(role => user.userCategory === role);
    
    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access denied: requires ${requiredRoles.join(' or ')} role`,
      );
    }
    
    return true;
  }
}

