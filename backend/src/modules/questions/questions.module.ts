import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Pregunta } from '../../entities/pregunta.entity';
import { Opcion } from '../../entities/opcion.entity';
import { Categoria } from '../../entities/categoria.entity';
import { Nivel } from '../../entities/nivel.entity';
import { Dificultad } from '../../entities/dificultad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pregunta, Opcion, Categoria, Nivel, Dificultad]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}

