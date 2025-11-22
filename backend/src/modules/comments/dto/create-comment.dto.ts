import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  pregunta_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  opcion_propuesta_id?: number;
}

