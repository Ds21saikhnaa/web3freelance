import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Job } from '../../jobs/entities/jobs.entity';
import { User } from '../../users/entities/user.entity';
import { JobStatus, WorkStatus } from '../../jobs/enum';

@Schema({ timestamps: true })
export class AcceptOffer {
  @Prop({ type: 'ObjectId', ref: 'Job', required: true })
  job: Job | mongoose.Types.ObjectId;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  freelancer: User | mongoose.Types.ObjectId;

  @Prop({ type: String, enum: JobStatus, default: JobStatus.Assigned })
  jobStatus: JobStatus;

  @Prop({ type: String, enum: WorkStatus, default: WorkStatus.Doing })
  workStatus: JobStatus;
}

export const AcceptOfferSchema = SchemaFactory.createForClass(AcceptOffer);
