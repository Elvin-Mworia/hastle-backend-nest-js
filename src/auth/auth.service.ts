import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user with email and password
   * @param loginDto The login credentials
   * @returns An object containing the JWT token and user information
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string; user: { _id: string; email: string; username: string; userCategory: string } }> {
    const { email, password } = loginDto;
    
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      access_token: token,
      user: {
        _id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        username: user.username,
        userCategory: user.userCategory,
      },
    };
  }

  /**
   * Compare a plaintext password with a hashed password
   * @param plainPassword The plaintext password
   * @param hashedPassword The hashed password
   * @returns Boolean indicating if the passwords match
   */
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate a JWT token for a user
   * @param user The user document
   * @returns A JWT token
   */
  generateToken(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: (user._id as Types.ObjectId).toString(),
      email: user.email,
      userCategory: user.userCategory,
    };
    
    return this.jwtService.sign(payload);
  }

  /**
   * Validate a user from JWT payload
   * @param payload The JWT payload
   * @returns The user document or null
   */
  async validateUser(payload: JwtPayload): Promise<User | null> {
    try {
      return this.usersService.findOne(payload.sub);
    } catch (error) {
      return null;
    }
  }
}
