// client.model.ts
import { Document, } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ default: true })
  isValidate: boolean;

  @Prop({ required: true })
  onboarded_by: string;

}

export const UserModel = SchemaFactory.createForClass(User);