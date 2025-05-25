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
  firstName: string;
  
  @Prop({ 
    required: true,
    trim: true,
  })
  lastName: string;

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

// Add index for email lookups
UserSchema.index({ email: 1 }, { unique: true });

// Add pre-save hook for password hashing
import * as bcrypt from 'bcrypt';

UserSchema.pre('save', async function(next) {
  const user = this;
  
  // Only hash the password if it's modified (or new)
  if (!user.isModified('password')) return next();
  
  try {
    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    const hash = await bcrypt.hash(user.password, salt);
    
    // Replace the plaintext password with the hash
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});
