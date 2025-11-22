import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoPregunta } from '../../../entities/pregunta.entity';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @IsEnum(EstadoPregunta)
  @IsOptional()
  estado?: EstadoPregunta;
}

