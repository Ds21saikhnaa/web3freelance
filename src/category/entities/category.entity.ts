import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: Boolean, default: false })
  isMain: boolean;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  icon: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
