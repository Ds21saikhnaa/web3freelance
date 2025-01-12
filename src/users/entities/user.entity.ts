import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../enum';

@Schema({ timestamps: false, _id: false })
export class Social {
  @Prop({ type: String })
  platform: string;

  @Prop({ type: String })
  link: string;
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

  @Prop({ type: Boolean, default: false })
  isVerify: string;

  @Prop({ enum: Role, type: String })
  role: Role;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, lowercase: true })
  userName: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String], default: [] })
  job_roles: string[];

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  nfts: string[];

  @Prop({ type: [Social], default: [] })
  contacts: Social[];
}

export const UserSchema = SchemaFactory.createForClass(User);
