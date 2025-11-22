import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Examen, EstadoExamen } from '../../entities/examen.entity';
import { ExamenPregunta } from '../../entities/examen-pregunta.entity';
import { Pregunta } from '../../entities/pregunta.entity';
import { Opcion } from '../../entities/opcion.entity';
import { QuestionsService } from '../questions/questions.service';
import { UsersService } from '../users/users.service';
import { StartExamDto } from './dto/start-exam.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Examen)
    private examenRepository: Repository<Examen>,
    @InjectRepository(ExamenPregunta)
    private examenPreguntaRepository: Repository<ExamenPregunta>,
    @InjectRepository(Pregunta)
    private preguntaRepository: Repository<Pregunta>,
    @InjectRepository(Opcion)
    private opcionRepository: Repository<Opcion>,
    private questionsService: QuestionsService,
    private usersService: UsersService,
  ) {}

  async startExam(userId: number, startExamDto: StartExamDto) {
    // Verificar límite diario
    const canTakeExam = await this.usersService.checkDailyLimit(userId, 'examenes');
    if (!canTakeExam) {
      throw new BadRequestException('Has alcanzado el límite diario de exámenes');
    }

    // Obtener preguntas aleatorias
    const preguntas = await this.questionsService.getRandomQuestions(
      startExamDto.num_preguntas || 20,
      {
        categoria_id: startExamDto.categoria_id,
        nivel_id: startExamDto.nivel_id,
        dificultad_id: startExamDto.dificultad_id,
      }
    );

    if (preguntas.length === 0) {
      throw new BadRequestException('No hay preguntas disponibles con los filtros seleccionados');
    }

    // Crear examen
    const examen = this.examenRepository.create({
      usuario_id: userId,
      categoria_id: startExamDto.categoria_id || null,
      estado: EstadoExamen.EN_PROGRESO,
      total_preguntas: preguntas.length,
      fecha_inicio: new Date(),
    });

    const savedExamen = await this.examenRepository.save(examen);

    // Crear examen_pregunta para cada pregunta
    const examenPreguntas = preguntas.map(pregunta =>
      this.examenPreguntaRepository.create({
        examen_id: savedExamen.id,
        pregunta_id: pregunta.id,
      })
    );

    await this.examenPreguntaRepository.save(examenPreguntas);

    // Incrementar contador diario
    await this.usersService.incrementDailyCount(userId, 'examenes');

    // Cargar examen con preguntas (sin respuestas correctas)
    return this.findOne(savedExamen.id, userId);
  }

  async answerQuestion(examenId: number, preguntaId: number, answerDto: AnswerQuestionDto, userId: number) {
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario_id: userId },
    });

    if (!examen) {
      throw new NotFoundException('Examen no encontrado');
    }

    if (examen.estado !== EstadoExamen.EN_PROGRESO) {
      throw new BadRequestException('El examen ya fue completado');
    }

    const examenPregunta = await this.examenPreguntaRepository.findOne({
      where: { examen_id: examenId, pregunta_id: preguntaId },
      relations: ['pregunta', 'opcion_seleccionada'],
    });

    if (!examenPregunta) {
      throw new NotFoundException('Pregunta no encontrada en este examen');
    }

    // Verificar si la opción es correcta
    const opcion = await this.opcionRepository.findOne({
      where: { id: answerDto.opcion_id, pregunta_id: preguntaId },
    });

    if (!opcion) {
      throw new NotFoundException('Opción no encontrada');
    }

    examenPregunta.opcion_seleccionada_id = answerDto.opcion_id;
    examenPregunta.es_correcta = opcion.es_correcta;
    examenPregunta.tiempo_segundos = answerDto.tiempo_segundos || 0;

    await this.examenPreguntaRepository.save(examenPregunta);

    return { correcta: opcion.es_correcta };
  }

  async finishExam(examenId: number, userId: number) {
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario_id: userId },
      relations: ['examenPreguntas'],
    });

    if (!examen) {
      throw new NotFoundException('Examen no encontrado');
    }

    if (examen.estado !== EstadoExamen.EN_PROGRESO) {
      return examen;
    }

    // Calcular resultados
    const respuestas = await this.examenPreguntaRepository.find({
      where: { examen_id: examenId },
      relations: ['opcion_seleccionada'],
    });

    const aciertos = respuestas.filter(r => r.es_correcta).length;
    const errores = respuestas.length - aciertos;
    const puntaje = Math.round((aciertos / examen.total_preguntas) * 100);

    const tiempoTotal = respuestas.reduce((sum, r) => sum + (r.tiempo_segundos || 0), 0);

    examen.estado = EstadoExamen.COMPLETADO;
    examen.aciertos = aciertos;
    examen.errores = errores;
    examen.puntaje = puntaje;
    examen.tiempo_segundos = tiempoTotal;
    examen.fecha_fin = new Date();

    await this.examenRepository.save(examen);

    return this.getResults(examenId, userId);
  }

  async getResults(examenId: number, userId: number) {
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario_id: userId },
      relations: ['categoria'],
    });

    if (!examen) {
      throw new NotFoundException('Examen no encontrado');
    }

    const examenPreguntas = await this.examenPreguntaRepository.find({
      where: { examen_id: examenId },
      relations: ['pregunta', 'opcion_seleccionada', 'pregunta.opciones'],
    });

    // Cargar todas las opciones correctas
    const preguntasIds = examenPreguntas.map(ep => ep.pregunta_id);
    const preguntas = await this.preguntaRepository.find({
      where: { id: preguntasIds as any },
      relations: ['opciones', 'categoria', 'nivel', 'dificultad'],
    });

    const preguntasMap = new Map(preguntas.map(p => [p.id, p]));

    const resultados = examenPreguntas.map(ep => {
      const pregunta = preguntasMap.get(ep.pregunta_id);
      return {
        pregunta: {
          id: pregunta.id,
          texto: pregunta.texto,
          explicacion: pregunta.explicacion,
          opciones: pregunta.opciones.map(op => ({
            id: op.id,
            texto: op.texto,
            es_correcta: op.es_correcta,
          })),
        },
        respuesta_usuario: ep.opcion_seleccionada ? {
          id: ep.opcion_seleccionada.id,
          texto: ep.opcion_seleccionada.texto,
        } : null,
        es_correcta: ep.es_correcta,
        tiempo_segundos: ep.tiempo_segundos,
      };
    });

    return {
      examen: {
        id: examen.id,
        estado: examen.estado,
        puntaje: examen.puntaje,
        aciertos: examen.aciertos,
        errores: examen.errores,
        total_preguntas: examen.total_preguntas,
        tiempo_segundos: examen.tiempo_segundos,
        fecha_inicio: examen.fecha_inicio,
        fecha_fin: examen.fecha_fin,
      },
      resultados,
    };
  }

  async findOne(id: number, userId: number) {
    const examen = await this.examenRepository.findOne({
      where: { id, usuario_id: userId },
      relations: ['categoria'],
    });

    if (!examen) {
      throw new NotFoundException('Examen no encontrado');
    }

    const examenPreguntas = await this.examenPreguntaRepository.find({
      where: { examen_id: id },
      relations: ['pregunta', 'pregunta.opciones'],
    });

    // Ocultar respuestas correctas si el examen está en progreso
    const preguntas = examenPreguntas.map(ep => ({
      id: ep.pregunta.id,
      texto: ep.pregunta.texto,
      opciones: ep.pregunta.opciones.map(op => ({
        id: op.id,
        texto: op.texto,
        es_correcta: ep.examen.estado === EstadoExamen.COMPLETADO ? op.es_correcta : undefined,
      })),
      opcion_seleccionada_id: ep.opcion_seleccionada_id,
      tiempo_segundos: ep.tiempo_segundos,
    }));

    return {
      examen: {
        id: examen.id,
        estado: examen.estado,
        total_preguntas: examen.total_preguntas,
        fecha_inicio: examen.fecha_inicio,
      },
      preguntas,
    };
  }

  async getUserExams(userId: number) {
    return this.examenRepository.find({
      where: { usuario_id: userId },
      relations: ['categoria'],
      order: { created_at: 'DESC' },
    });
  }
}

