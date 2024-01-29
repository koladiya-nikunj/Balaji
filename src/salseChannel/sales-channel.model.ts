// client.model.ts
import { Document, } from 'mongoose';
import { Prop, SchemaFactory,Schema } from '@nestjs/mongoose';
  
@Schema()
export class Client extends Document {
  @Prop({ required: true})
  email: string;

  @Prop({required: true})
  salesId: string;

  @Prop({required: true})
  onboardCount: number;
}

export const ClientModel = SchemaFactory.createForClass(Client);
