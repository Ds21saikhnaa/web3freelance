import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/entities/user.entity';
import mongoose from 'mongoose';
import { Job } from '../../jobs/entities/jobs.entity';

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: ['ObjectId'], ref: 'User', default: [] })
  participants: User[] | mongoose.Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  isGroup: boolean;

  @Prop({ type: String, required: false })
  groupName: string;

  @Prop({ type: 'ObjectId', ref: 'Job' })
  job: Job | mongoose.Types.ObjectId;
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: 'ObjectId', ref: 'Chat' })
  chatId: Chat[] | mongoose.Types.ObjectId[];

  @Prop({ type: 'ObjectId', ref: 'User' })
  sender: User | mongoose.Types.ObjectId;

  @Prop()
  message: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const MessageSchema = SchemaFactory.createForClass(Message);
