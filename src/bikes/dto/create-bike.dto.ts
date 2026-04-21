import {
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { BikeType } from '../entities/bike.entity';

export class CreateBikeDto {
  @IsString()
  @MinLength(1)
  marca!: string;

  @IsEnum(BikeType, {
    message: `El tipo debe ser: ${Object.values(BikeType).join(', ')}`,
  })
  tipo!: BikeType;

  @IsInt()
  @IsPositive()
  velocidades!: number;

  @IsString()
  descripcion!: string;
}
