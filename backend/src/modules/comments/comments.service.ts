import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from '../../entities/comentario.entity';
import { VotoComentario, TipoVoto } from '../../entities/voto-comentario.entity';
import { Pregunta } from '../../entities/pregunta.entity';
import { Opcion } from '../../entities/opcion.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { VoteCommentDto } from './dto/vote-comment.dto';
import { ReportQuestionDto } from './dto/report-question.dto';
import { ReportePregunta } from '../../entities/reporte-pregunta.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comentario)
    private comentarioRepository: Repository<Comentario>,
    @InjectRepository(VotoComentario)
    private votoComentarioRepository: Repository<VotoComentario>,
    @InjectRepository(Pregunta)
    private preguntaRepository: Repository<Pregunta>,
    @InjectRepository(Opcion)
    private opcionRepository: Repository<Opcion>,
    @InjectRepository(ReportePregunta)
    private reportePreguntaRepository: Repository<ReportePregunta>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const pregunta = await this.preguntaRepository.findOne({
      where: { id: createCommentDto.pregunta_id },
    });

    if (!pregunta) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    if (createCommentDto.opcion_propuesta_id) {
      const opcion = await this.opcionRepository.findOne({
        where: { id: createCommentDto.opcion_propuesta_id, pregunta_id: createCommentDto.pregunta_id },
      });

      if (!opcion) {
        throw new NotFoundException('Opción no encontrada para esta pregunta');
      }
    }

    const comentario = this.comentarioRepository.create({
      usuario_id: userId,
      pregunta_id: createCommentDto.pregunta_id,
      texto: createCommentDto.texto,
      opcion_propuesta_id: createCommentDto.opcion_propuesta_id || null,
    });

    return this.comentarioRepository.save(comentario);
  }

  async findByQuestion(preguntaId: number) {
    const comentarios = await this.comentarioRepository.find({
      where: { pregunta_id: preguntaId, activo: true },
      relations: ['usuario', 'opcion_propuesta'],
      order: { created_at: 'DESC' },
    });

    return comentarios.map(comentario => ({
      id: comentario.id,
      texto: comentario.texto,
      usuario: {
        id: comentario.usuario.id,
        nombre: comentario.usuario.nombre,
        apellido: comentario.usuario.apellido,
      },
      opcion_propuesta: comentario.opcion_propuesta ? {
        id: comentario.opcion_propuesta.id,
        texto: comentario.opcion_propuesta.texto,
      } : null,
      votos_positivos: comentario.votos_positivos,
      votos_negativos: comentario.votos_negativos,
      created_at: comentario.created_at,
    }));
  }

  async vote(voteDto: VoteCommentDto, userId: number) {
    const comentario = await this.comentarioRepository.findOne({
      where: { id: voteDto.comentario_id },
    });

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Verificar si ya votó
    const votoExistente = await this.votoComentarioRepository.findOne({
      where: {
        usuario_id: userId,
        comentario_id: voteDto.comentario_id,
      },
    });

    if (votoExistente) {
      if (votoExistente.tipo === voteDto.tipo) {
        // Eliminar voto si es el mismo tipo
        await this.votoComentarioRepository.remove(votoExistente);
        
        if (voteDto.tipo === TipoVoto.POSITIVO) {
          comentario.votos_positivos = Math.max(0, comentario.votos_positivos - 1);
        } else {
          comentario.votos_negativos = Math.max(0, comentario.votos_negativos - 1);
        }
      } else {
        // Cambiar voto
        votoExistente.tipo = voteDto.tipo;
        await this.votoComentarioRepository.save(votoExistente);

        if (voteDto.tipo === TipoVoto.POSITIVO) {
          comentario.votos_positivos += 1;
          comentario.votos_negativos = Math.max(0, comentario.votos_negativos - 1);
        } else {
          comentario.votos_negativos += 1;
          comentario.votos_positivos = Math.max(0, comentario.votos_positivos - 1);
        }
      }
    } else {
      // Nuevo voto
      const voto = this.votoComentarioRepository.create({
        usuario_id: userId,
        comentario_id: voteDto.comentario_id,
        tipo: voteDto.tipo,
      });
      await this.votoComentarioRepository.save(voto);

      if (voteDto.tipo === TipoVoto.POSITIVO) {
        comentario.votos_positivos += 1;
      } else {
        comentario.votos_negativos += 1;
      }
    }

    await this.comentarioRepository.save(comentario);

    return {
      votos_positivos: comentario.votos_positivos,
      votos_negativos: comentario.votos_negativos,
    };
  }

  async reportQuestion(reportDto: ReportQuestionDto, userId: number) {
    const pregunta = await this.preguntaRepository.findOne({
      where: { id: reportDto.pregunta_id },
    });

    if (!pregunta) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    const reporte = this.reportePreguntaRepository.create({
      usuario_id: userId,
      pregunta_id: reportDto.pregunta_id,
      tipo: reportDto.tipo,
      descripcion: reportDto.descripcion,
    });

    return this.reportePreguntaRepository.save(reporte);
  }
}

