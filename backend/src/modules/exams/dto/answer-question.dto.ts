import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerQuestionDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  examen_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  pregunta_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  opcion_id: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  tiempo_segundos?: number;
}

