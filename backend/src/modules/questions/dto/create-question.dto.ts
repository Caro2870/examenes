import { IsString, IsNotEmpty, IsInt, IsArray, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateOpcionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty()
  @IsBoolean()
  es_correcta: boolean;
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  explicacion?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  categoria_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  nivel_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  dificultad_id: number;

  @ApiProperty({ type: [CreateOpcionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDto)
  opciones: CreateOpcionDto[];

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  generada_ia?: boolean;
}

