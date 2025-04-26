import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserCategory {
  EMPLOYER = 'employer',
  WORKER = 'worker',
}

export type UserDocument = User & Document;

@Schema({
  timestamps: true, // Automatically add createdAt and updatedAt
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password; // Don't return password in API responses
      return ret;
    },
    virtuals: true,
  },
})
export class User {
  @Prop({ 
    required: true,
    trim: true,
  })
  username: string;

  @Prop({ 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ 
    required: true,
  })
  password: string;

  @Prop({ 
    required: true,
    enum: [UserCategory.EMPLOYER, UserCategory.WORKER],
    default: UserCategory.WORKER,
  })
  userCategory: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


