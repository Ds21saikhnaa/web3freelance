import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  owner: string;

  @Prop({ type: Boolean, default: false })
  isUsed: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);
