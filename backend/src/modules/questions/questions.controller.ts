import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FilterQuestionsDto } from './dto/filter-questions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../../entities/role.entity';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de preguntas' })
  @ApiResponse({ status: 200, description: 'Lista de preguntas' })
  async findAll(@Query() filterDto: FilterQuestionsDto) {
    return this.questionsService.findAll(filterDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obtener categorías' })
  async getCategories() {
    return this.questionsService.getCategories();
  }

  @Get('niveles')
  @ApiOperation({ summary: 'Obtener niveles' })
  async getNiveles() {
    return this.questionsService.getNiveles();
  }

  @Get('dificultades')
  @ApiOperation({ summary: 'Obtener dificultades' })
  async getDificultades() {
    return this.questionsService.getDificultades();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pregunta por ID' })
  @ApiResponse({ status: 200, description: 'Pregunta encontrada' })
  @ApiResponse({ status: 404, description: 'Pregunta no encontrada' })
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva pregunta (Admin)' })
  @ApiResponse({ status: 201, description: 'Pregunta creada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
    return this.questionsService.create(createQuestionDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar pregunta (Admin)' })
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar pregunta (Admin)' })
  async remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }
}

