import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Bike } from './entities/bike.entity';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

@Injectable()
export class BikesService {
  private readonly logger = new Logger('BikesService');

  constructor(
    @InjectModel(Bike.name)
    private readonly bikeModel: Model<Bike>,
  ) {}

  async create(createBikeDto: CreateBikeDto) {
    try {
      const bike = await this.bikeModel.create(createBikeDto);
      return bike;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    return this.bikeModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es un ID válido`);
    }
    const bike = await this.bikeModel.findById(id);
    if (!bike)
      throw new NotFoundException(`Bicicleta con id ${id} no encontrada`);
    return bike;
  }

  async update(id: string, updateBikeDto: UpdateBikeDto) {
    const bike = await this.findOne(id);
    try {
      await bike.updateOne(updateBikeDto);
      return { ...bike.toJSON(), ...updateBikeDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.bikeModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Bicicleta con id ${id} no encontrada`);
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
        `La marca ya existe: ${JSON.stringify(mongoError.keyValue)}`,
      );
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      `Error en el servidor, revisa los logs`,
    );
  }
}
