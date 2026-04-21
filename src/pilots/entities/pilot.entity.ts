import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pilot extends Document {
  @Prop()
  nombre!: string;

  @Prop()
  escuderia!: string;

  @Prop({ default: true })
  activo!: boolean;

  @Prop({ default: 0 })
  campeonatos!: number;

  @Prop({ unique: true, index: true })
  numero!: number; // Este debe ser único (ej: 33 para Max Verstappen)
}

export const PilotSchema = SchemaFactory.createForClass(Pilot);
