import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key-here',
    });
  }

  /**
   * Validate the JWT payload and return the user
   * @param payload The decoded JWT payload
   * @returns The validated user
   */
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return user;
  }
}

