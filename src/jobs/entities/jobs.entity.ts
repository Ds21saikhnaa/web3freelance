import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { JobStatus } from '../enum';

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  delivery_time: string;

  @Prop({ type: String, enum: JobStatus, default: JobStatus.Open })
  status: JobStatus;

  @Prop({ type: String })
  main_category: string;

  @Prop({ type: [String] })
  categories: string[];

  @Prop({ type: [String] })
  requirementSkills: string[];

  @Prop({ type: String })
  client: string;

  @Prop({ type: Number })
  gig_amount: number;
}

export const JobSchema = SchemaFactory.createForClass(Job);
