import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { Examen } from '../../entities/examen.entity';
import { ExamenPregunta } from '../../entities/examen-pregunta.entity';
import { Pregunta } from '../../entities/pregunta.entity';
import { Opcion } from '../../entities/opcion.entity';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Examen, ExamenPregunta, Pregunta, Opcion]),
    QuestionsModule,
    UsersModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}

