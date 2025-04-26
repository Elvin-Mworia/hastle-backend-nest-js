import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

// GeoJSON Point Interface
export interface Point {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export type JobDocument = Job & Document;

@Schema({
  timestamps: true,
})
export class Job {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Employer',
    required: true,
  })
  employerId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: Point;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  date: Date;

  @Prop({
    type: [String],
    default: [],
  })
  skillsNeeded: string[];

  @Prop({
    type: Number,
    required: true,
  })
  pay: number;

  @Prop({
    type: String,
    required: true,
  })
  duration: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Worker' }],
    default: [],
  })
  workersApplied: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: String,
    enum: [JobStatus.OPEN, JobStatus.CLOSED],
    default: JobStatus.OPEN,
  })
  status: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Worker',
    default: null,
  })
  workerAwarded: MongooseSchema.Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);

// Add geospatial index for location queries
JobSchema.index({ location: '2dsphere' });

