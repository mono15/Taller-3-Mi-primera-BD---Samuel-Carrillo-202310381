import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BikeType {
  mountain = 'mountain',
  road = 'road',
  city = 'city',
  electric = 'electric',
}

@Schema()
export class Bike extends Document {
  @Prop({ unique: true, index: true })
  marca!: string;

  @Prop({ type: String, enum: BikeType })
  tipo!: BikeType;

  @Prop()
  velocidades!: number;

  @Prop()
  descripcion!: string;
}

export const BikeSchema = SchemaFactory.createForClass(Bike);
