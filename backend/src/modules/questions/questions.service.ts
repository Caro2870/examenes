import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Pregunta, EstadoPregunta } from '../../entities/pregunta.entity';
import { Opcion } from '../../entities/opcion.entity';
import { Categoria } from '../../entities/categoria.entity';
import { Nivel } from '../../entities/nivel.entity';
import { Dificultad } from '../../entities/dificultad.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FilterQuestionsDto } from './dto/filter-questions.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Pregunta)
    private preguntaRepository: Repository<Pregunta>,
    @InjectRepository(Opcion)
    private opcionRepository: Repository<Opcion>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    @InjectRepository(Nivel)
    private nivelRepository: Repository<Nivel>,
    @InjectRepository(Dificultad)
    private dificultadRepository: Repository<Dificultad>,
  ) {}

  async findAll(filterDto: FilterQuestionsDto) {
    const query = this.preguntaRepository.createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.categoria', 'categoria')
      .leftJoinAndSelect('pregunta.nivel', 'nivel')
      .leftJoinAndSelect('pregunta.dificultad', 'dificultad')
      .leftJoinAndSelect('pregunta.opciones', 'opciones')
      .where('pregunta.estado = :estado', { estado: 'aprobada' });

    if (filterDto.categoria_id) {
      query.andWhere('pregunta.categoria_id = :categoria_id', { categoria_id: filterDto.categoria_id });
    }

    if (filterDto.nivel_id) {
      query.andWhere('pregunta.nivel_id = :nivel_id', { nivel_id: filterDto.nivel_id });
    }

    if (filterDto.dificultad_id) {
      query.andWhere('pregunta.dificultad_id = :dificultad_id', { dificultad_id: filterDto.dificultad_id });
    }

    if (filterDto.limit) {
      query.limit(filterDto.limit);
    }

    if (filterDto.offset) {
      query.offset(filterDto.offset);
    }

    const [data, total] = await query.getManyAndCount();

    // Ocultar respuesta correcta
    data.forEach(pregunta => {
      pregunta.opciones = pregunta.opciones.map(opcion => ({
        ...opcion,
        es_correcta: undefined,
      })) as any;
    });

    return { data, total };
  }

  async findOne(id: number, includeCorrect: boolean = false) {
    const pregunta = await this.preguntaRepository.findOne({
      where: { id },
      relations: ['categoria', 'nivel', 'dificultad', 'opciones'],
    });

    if (!pregunta) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    if (!includeCorrect) {
      pregunta.opciones = pregunta.opciones.map(opcion => ({
        ...opcion,
        es_correcta: undefined,
      })) as any;
    }

    return pregunta;
  }

  async create(createQuestionDto: CreateQuestionDto, userId: number) {
    // Validar que solo una opción sea correcta
    const correctas = createQuestionDto.opciones.filter(op => op.es_correcta);
    if (correctas.length !== 1) {
      throw new BadRequestException('Debe haber exactamente una opción correcta');
    }

    const preguntaData: Partial<Pregunta> = {
      texto: createQuestionDto.texto,
      explicacion: createQuestionDto.explicacion,
      categoria_id: createQuestionDto.categoria_id,
      nivel_id: createQuestionDto.nivel_id,
      dificultad_id: createQuestionDto.dificultad_id,
      generada_ia: createQuestionDto.generada_ia || false,
      estado: createQuestionDto.generada_ia ? EstadoPregunta.PENDIENTE : EstadoPregunta.APROBADA,
    };
    const pregunta = this.preguntaRepository.create(preguntaData);
    const savedPregunta = await this.preguntaRepository.save(pregunta);

    const opciones = createQuestionDto.opciones.map(opcion => 
      this.opcionRepository.create({
        ...opcion,
        pregunta_id: savedPregunta.id,
      })
    );

    await this.opcionRepository.save(opciones);

    return this.findOne(savedPregunta.id, true);
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const pregunta = await this.findOne(id, true);

    if (updateQuestionDto.opciones) {
      const correctas = updateQuestionDto.opciones.filter(op => op.es_correcta);
      if (correctas.length !== 1) {
        throw new BadRequestException('Debe haber exactamente una opción correcta');
      }

      await this.opcionRepository.delete({ pregunta_id: id });
      const opciones = updateQuestionDto.opciones.map(opcion =>
        this.opcionRepository.create({
          ...opcion,
          pregunta_id: id,
        })
      );
      await this.opcionRepository.save(opciones);
    }

    Object.assign(pregunta, updateQuestionDto);
    delete (pregunta as any).opciones;

    await this.preguntaRepository.save(pregunta);

    return this.findOne(id, true);
  }

  async remove(id: number) {
    const pregunta = await this.findOne(id);
    await this.preguntaRepository.remove(pregunta);
    return { message: 'Pregunta eliminada exitosamente' };
  }

  async getRandomQuestions(count: number, filters?: FilterQuestionsDto): Promise<Pregunta[]> {
    const query = this.preguntaRepository.createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'opciones')
      .where('pregunta.estado = :estado', { estado: 'aprobada' });

    if (filters?.categoria_id) {
      query.andWhere('pregunta.categoria_id = :categoria_id', { categoria_id: filters.categoria_id });
    }

    if (filters?.nivel_id) {
      query.andWhere('pregunta.nivel_id = :nivel_id', { nivel_id: filters.nivel_id });
    }

    if (filters?.dificultad_id) {
      query.andWhere('pregunta.dificultad_id = :dificultad_id', { dificultad_id: filters.dificultad_id });
    }

    const preguntas = await query.getMany();
    
    // Mezclar y tomar count
    const shuffled = preguntas.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    // Ocultar respuesta correcta
    selected.forEach(pregunta => {
      pregunta.opciones = pregunta.opciones.map(opcion => ({
        ...opcion,
        es_correcta: undefined,
      })) as any;
    });

    return selected;
  }

  async getCategories() {
    return this.categoriaRepository.find({ where: { activo: true } });
  }

  async getNiveles() {
    return this.nivelRepository.find();
  }

  async getDificultades() {
    return this.dificultadRepository.find();
  }
}

