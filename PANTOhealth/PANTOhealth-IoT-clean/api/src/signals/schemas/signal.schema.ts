import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SignalDocument = HydratedDocument<Signal>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Signal {
  @Prop({ required: true, index: true }) deviceId: string;
  @Prop({ required: true, index: true }) time: number;
  @Prop({ required: true }) dataLength: number;
  @Prop({ required: true }) dataVolume: number;
  @Prop({ type: Object })
  stats?: {
    speed: { min: number; max: number; avg: number };
    bbox: { minX: number; maxX: number; minY: number; maxY: number };
  };
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
