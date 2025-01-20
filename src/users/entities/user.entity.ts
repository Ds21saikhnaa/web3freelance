import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
  bio: string;

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
  nfts: string[];

  @Prop({ type: [String], default: [] })
  badges: string[];

  @Prop({ type: Number, default: 0 })
  reward: number;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({ type: Number, default: 0 })
  budget: number;

  @Prop({ type: String, default: null })
  nonce: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
