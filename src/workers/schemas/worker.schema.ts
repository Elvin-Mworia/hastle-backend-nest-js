import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';

export type WorkerDocument = Worker & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password; // Inherit password hiding from User schema
      return ret;
    },
    virtuals: true,
  },
})
export class Worker extends User {
  @Prop({
    type: Number,
    default: 0,
  })
  credit: number;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Job' }],
    default: [],
  })
  previousWorks: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [String],
    default: [],
  })
  expertise: string[];

  @Prop({
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  })
  ratings: number;

  @Prop({
    type: String,
    default: '',
  })
  photoUrl: string;

  @Prop({
    type: Number,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v.toString());
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    },
    required: [true, 'Phone number is required']
  })
  phone: number;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);

