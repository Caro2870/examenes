import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comentario } from '../../entities/comentario.entity';
import { VotoComentario } from '../../entities/voto-comentario.entity';
import { Pregunta } from '../../entities/pregunta.entity';
import { Opcion } from '../../entities/opcion.entity';
import { ReportePregunta } from '../../entities/reporte-pregunta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comentario, VotoComentario, Pregunta, Opcion, ReportePregunta]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

