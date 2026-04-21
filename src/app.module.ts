import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsModule } from './cars/cars.module';
import { BikesModule } from './bikes/bikes.module';
import { PilotsModule } from './pilots/pilots.module';

@Module({
  imports: [
    // 1. Cargamos variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Conexión asíncrona a Mongo
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URL,
      }),
    }),

    CarsModule,

    BikesModule,

    PilotsModule,
  ],
})
export class AppModule {}
