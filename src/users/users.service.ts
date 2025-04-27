import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  /**
   * Create a new user
   * @param createUserDto - The data to create the user
   * @returns The created user object (without password)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if email already exists
      const emailExists = await this.emailExists(createUserDto.email);
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }

      // Create and save the new user (password will be hashed by the pre-save hook)
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      // Handle Mongoose duplicate key error
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      
      // Re-throw if it's already a NestJS exception
      if (error.status) {
        throw error;
      }
      
      // Otherwise, wrap in an internal server error
      throw new InternalServerErrorException('Error creating user');
    }
  }

  /**
   * Find all users
   * @returns Array of all users (without passwords)
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Find a user by ID
   * @param id - The user ID
   * @returns The user object or null if not found
   */
  async findOne(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding user');
    }
  }

  /**
   * Find a user by email - used for authentication
   * @param email - The email address to search for
   * @returns The complete user document including password for auth verification
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      // Use lean() to get a plain JavaScript object instead of a Mongoose document
      // This is necessary to include the password field which is normally excluded
      return this.userModel.findOne({ email }).select('+password').exec();
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  /**
   * Check if an email already exists
   * @param email - The email to check
   * @returns Boolean indicating if the email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }

  /**
   * Update a user
   * @param id - The user ID
   * @param updateUserDto - The data to update
   * @returns The updated user object
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
        
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      return updatedUser;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  /**
   * Remove a user
   * @param id - The user ID
   * @returns The deleted user object
   */
  async remove(id: string): Promise<User | null> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      
      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      return deletedUser;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
