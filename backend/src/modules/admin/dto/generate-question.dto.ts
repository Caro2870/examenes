import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateQuestionDto {
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
}

