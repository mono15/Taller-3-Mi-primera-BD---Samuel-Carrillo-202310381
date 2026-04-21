import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @MinLength(1)
  nombre!: string;

  @IsString()
  @MinLength(1)
  modelo!: string;

  @IsInt()
  @IsPositive()
  anio!: number;

  @IsString()
  frase!: string;
}
