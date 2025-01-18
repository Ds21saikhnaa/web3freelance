import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: 'ObjectId', ref: 'Category' })
  parent: Category | mongoose.Types.ObjectId;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  icon: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
