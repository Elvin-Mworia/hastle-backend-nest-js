import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Override the canActivate method to add custom error handling
   * @param context The execution context
   * @returns A boolean or a promise resolving to a boolean
   */
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  /**
   * Handle JWT validation errors
   * @param err The error object
   * @returns A user object or throws an exception
   */
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Authentication required');
    }
    return user;
  }
}

