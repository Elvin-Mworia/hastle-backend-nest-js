import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);


