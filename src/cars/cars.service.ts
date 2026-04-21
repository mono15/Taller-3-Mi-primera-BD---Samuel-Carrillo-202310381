import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  private readonly logger = new Logger('CarsService');

  constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<Car>,
  ) {}

  async create(createCarDto: CreateCarDto) {
    createCarDto.nombre = createCarDto.nombre.toLowerCase();
    try {
      const car = await this.carModel.create(createCarDto);
      return car;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    return this.carModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es un ID de Mongo válido`);
    }
    const car = await this.carModel.findById(id);
    if (!car) throw new NotFoundException(`Carro con id ${id} no encontrado`);
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const car = await this.findOne(id);
    if (updateCarDto.nombre)
      updateCarDto.nombre = updateCarDto.nombre.toLowerCase();

    try {
      await car.updateOne(updateCarDto);
      return { ...car.toJSON(), ...updateCarDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.carModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Carro con id ${id} no encontrado`);
    }
    return { deleted: true };
  }

  private handleException(error: any) {
    const mongoError = error as {
      code?: number;
      keyValue?: Record<string, any>;
    };

    if (mongoError.code === 11000) {
      throw new BadRequestException(
        `El carro ya existe en la DB: ${JSON.stringify(mongoError.keyValue)}`,
      );
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      `Error en el servidor, revisa los logs`,
    );
  }
}
