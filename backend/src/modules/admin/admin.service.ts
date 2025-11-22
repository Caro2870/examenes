import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pregunta, EstadoPregunta } from '../../entities/pregunta.entity';
import { Opcion } from '../../entities/opcion.entity';
import { Categoria } from '../../entities/categoria.entity';
import { Nivel } from '../../entities/nivel.entity';
import { Dificultad } from '../../entities/dificultad.entity';
import { ReportePregunta, EstadoReporte } from '../../entities/reporte-pregunta.entity';
import { CreateQuestionDto } from '../questions/dto/create-question.dto';
import { QuestionsService } from '../questions/questions.service';
import { GenerateQuestionDto } from './dto/generate-question.dto';

@Injectable()
export class AdminService {
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
    @InjectRepository(ReportePregunta)
    private reportePreguntaRepository: Repository<ReportePregunta>,
    private questionsService: QuestionsService,
  ) {}

  async approveQuestion(questionId: number, userId: number) {
    const pregunta = await this.preguntaRepository.findOne({
      where: { id: questionId },
    });

    if (!pregunta) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    pregunta.estado = EstadoPregunta.APROBADA;
    pregunta.aprobado_por_id = userId;
    await this.preguntaRepository.save(pregunta);

    return pregunta;
  }

  async rejectQuestion(questionId: number, userId: number) {
    const pregunta = await this.preguntaRepository.findOne({
      where: { id: questionId },
    });

    if (!pregunta) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    pregunta.estado = EstadoPregunta.RECHAZADA;
    pregunta.aprobado_por_id = userId;
    await this.preguntaRepository.save(pregunta);

    return pregunta;
  }

  async getPendingQuestions() {
    return this.preguntaRepository.find({
      where: { estado: EstadoPregunta.PENDIENTE },
      relations: ['categoria', 'nivel', 'dificultad', 'opciones'],
      order: { created_at: 'DESC' },
    });
  }

  async generateQuestionWithAI(generateDto: GenerateQuestionDto, userId: number) {
    // Simulación de generación por IA
    // En producción, aquí se integraría con OpenAI, Anthropic, etc.
    
    const categoria = await this.categoriaRepository.findOne({
      where: { id: generateDto.categoria_id },
    });
    const nivel = await this.nivelRepository.findOne({
      where: { id: generateDto.nivel_id },
    });
    const dificultad = await this.dificultadRepository.findOne({
      where: { id: generateDto.dificultad_id },
    });

    if (!categoria || !nivel || !dificultad) {
      throw new NotFoundException('Categoría, nivel o dificultad no encontrados');
    }

    // Generar pregunta simulada (en producción usar API de IA)
    const preguntaTexto = `Pregunta generada por IA sobre ${categoria.nombre} - ${nivel.nombre} - ${dificultad.nombre}`;
    
    const createQuestionDto: CreateQuestionDto = {
      texto: preguntaTexto,
      explicacion: 'Explicación generada automáticamente',
      categoria_id: generateDto.categoria_id,
      nivel_id: generateDto.nivel_id,
      dificultad_id: generateDto.dificultad_id,
      opciones: [
        { texto: 'Opción A', es_correcta: true },
        { texto: 'Opción B', es_correcta: false },
        { texto: 'Opción C', es_correcta: false },
        { texto: 'Opción D', es_correcta: false },
      ],
      generada_ia: true,
    };

    return this.questionsService.create(createQuestionDto, userId);
  }

  async getReports() {
    return this.reportePreguntaRepository.find({
      where: { estado: EstadoReporte.PENDIENTE },
      relations: ['pregunta', 'usuario'],
      order: { created_at: 'DESC' },
    });
  }

  async updateReportStatus(reportId: number, estado: EstadoReporte) {
    const reporte = await this.reportePreguntaRepository.findOne({
      where: { id: reportId },
    });

    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado');
    }

    reporte.estado = estado;
    return this.reportePreguntaRepository.save(reporte);
  }

  async getCategories() {
    return this.categoriaRepository.find();
  }

  async createCategory(nombre: string, descripcion?: string) {
    const categoria = this.categoriaRepository.create({ nombre, descripcion });
    return this.categoriaRepository.save(categoria);
  }

  async updateCategory(id: number, nombre?: string, descripcion?: string, activo?: boolean) {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    if (nombre) categoria.nombre = nombre;
    if (descripcion !== undefined) categoria.descripcion = descripcion;
    if (activo !== undefined) categoria.activo = activo;

    return this.categoriaRepository.save(categoria);
  }

  async processExcelFile(file: Express.Multer.File, userId: number) {
    // TODO: Implementar procesamiento de Excel
    // Por ahora, retornar un mensaje indicando que la funcionalidad está en desarrollo
    // Para implementar completamente, instalar: npm install xlsx
    // y procesar el archivo Excel para extraer las preguntas
    
    if (!file) {
      throw new NotFoundException('Archivo no proporcionado');
    }

    // Validar tipo de archivo
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    
    if (!allowedMimes.includes(file.mimetype)) {
      throw new NotFoundException('Tipo de archivo no válido. Solo se aceptan archivos Excel (.xlsx, .xls)');
    }

    // Por ahora, retornar un mensaje
    // En producción, aquí se procesaría el archivo Excel y se crearían las preguntas
    return {
      message: 'Funcionalidad de importación desde Excel en desarrollo. El archivo fue recibido correctamente.',
      filename: file.originalname,
      size: file.size,
    };
  }
}

