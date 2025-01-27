import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Job } from '../../jobs/entities/jobs.entity';
import mongoose from 'mongoose';
import { ArrayMaxSize } from 'class-validator';

@Schema({ timestamps: false, _id: false })
export class Review {
  @Prop({ type: Number, default: 0, max: 5, min: 0 })
  rating: number;

  @Prop({ type: String })
  comment: string;

  @Prop({ type: 'ObjectId', ref: 'Job', required: false })
  job: Job | mongoose.Types.ObjectId;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  reviewer: User | mongoose.Types.ObjectId;
}

@Schema({ timestamps: false, _id: false })
export class Budget {
  @Prop({ type: Number })
  amount: number;
  @Prop({ type: String })
  day: string;
  @Prop({ type: String })
  description: string;
}

@Schema({ timestamps: true })
export class User {
  _id: string;

  @Prop({
    type: String,
    unique: true,
    index: true,
    required: true,
  })
  web3address: string;

  @Prop({ type: String, lowercase: true })
  userName: string;

  @Prop({ type: String })
  bio: any[];

  @Prop({ type: String })
  twitter: string;

  @Prop({ type: String })
  email: string;

  @Prop({
    type: String,
    default:
      'https://placehold.co/150X150/EEE/31343C?font=playfair-display&text=ape',
  })
  profile: string;

  @Prop({ type: [String], default: [] })
  job_roles: string[];

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  @ArrayMaxSize(3, { message: 'You can select a maximum of 3 badges.' })
  selected_badges: string[];

  @Prop({ type: ['ObjectId'], ref: 'Job', default: [] })
  saved_jobs: Job[] | mongoose.Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  badges: string[];

  @Prop({ type: Number, default: 0 })
  reward: number;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({ type: [Review], default: [] })
  reviews: Review[];

  @Prop({ type: Budget, default: null })
  budget: Budget;

  @Prop({ type: String, default: null })
  nonce: string | null;

  @Prop({ type: Date, default: new Date() })
  lastSynced: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
