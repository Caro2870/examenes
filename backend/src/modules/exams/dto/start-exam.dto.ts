import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StartExamDto {
  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(100)
  num_preguntas?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  categoria_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  nivel_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  dificultad_id?: number;
}

