import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import mongoose from 'mongoose';
import { JobStatus } from '../enum';

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  user: User | mongoose.Types.ObjectId;

  @Prop({ type: 'ObjectId', ref: 'Job', required: true })
  job: Job | mongoose.Types.ObjectId;

  @Prop()
  amount: number;

  @Prop({ type: String })
  duration_time: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Boolean, default: false })
  isSelected: boolean;
}

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  duration_time: string;

  @Prop({ type: String, enum: JobStatus, default: JobStatus.Open })
  status: JobStatus;

  @Prop({ type: String })
  main_category: string;

  @Prop({ type: [String] })
  categories: string[];

  @Prop({ type: [String] })
  requirement: string[];

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  client: User | mongoose.Types.ObjectId;

  @Prop({ type: Number })
  gig_budget: number;

  @Prop({ type: ['ObjectId'], ref: 'Bid', default: [] })
  bids: Bid[] | mongoose.Types.ObjectId[];

  @Prop({ type: Number })
  bid_day: number;
}

export const JobSchema = SchemaFactory.createForClass(Job);
export const BidSchema = SchemaFactory.createForClass(Bid);
