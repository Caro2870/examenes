import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Pregunta, EstadoPregunta } from '../../entities/pregunta.entity';
import { Opcion } from '../../entities/opcion.entity';
import { Categoria } from '../../entities/categoria.entity';
import { Nivel } from '../../entities/nivel.entity';
import { Dificultad } from '../../entities/dificultad.entity';
import { ReportePregunta } from '../../entities/reporte-pregunta.entity';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pregunta, Opcion, Categoria, Nivel, Dificultad, ReportePregunta]),
    QuestionsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

