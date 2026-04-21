import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pilot } from './entities/pilot.entity';
import { CreatePilotDto } from './dto/create-pilot.dto';
import { UpdatePilotDto } from './dto/update-pilot.dto';

@Injectable()
export class PilotsService {
  private readonly logger = new Logger('PilotsService');

  constructor(
    @InjectModel(Pilot.name)
    private readonly pilotModel: Model<Pilot>,
  ) {}

  async create(createPilotDto: CreatePilotDto) {
    try {
      const pilot = await this.pilotModel.create(createPilotDto);
      return pilot;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    return this.pilotModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es un ID válido de MongoDB`);
    }
    const pilot = await this.pilotModel.findById(id);
    if (!pilot)
      throw new NotFoundException(`Piloto con id ${id} no encontrado`);
    return pilot;
  }

  async update(id: string, updatePilotDto: UpdatePilotDto) {
    const pilot = await this.findOne(id);
    try {
      await pilot.updateOne(updatePilotDto);
      return { ...pilot.toJSON(), ...updatePilotDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pilotModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Piloto con id ${id} no encontrado`);
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
        `Ese número o dato ya existe: ${JSON.stringify(mongoError.keyValue)}`,
      );
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      `Error en el servidor, revisa los logs`,
    );
  }
}
