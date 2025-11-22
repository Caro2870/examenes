import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { GenerateQuestionDto } from './dto/generate-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../../entities/role.entity';
import { EstadoReporte } from '../../entities/reporte-pregunta.entity';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.SUPERADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('questions/pending')
  @ApiOperation({ summary: 'Obtener preguntas pendientes de aprobación' })
  async getPendingQuestions() {
    return this.adminService.getPendingQuestions();
  }

  @Post('questions/:id/approve')
  @ApiOperation({ summary: 'Aprobar pregunta generada por IA' })
  async approveQuestion(@Param('id') id: string, @Request() req) {
    return this.adminService.approveQuestion(+id, req.user.id);
  }

  @Post('questions/:id/reject')
  @ApiOperation({ summary: 'Rechazar pregunta generada por IA' })
  async rejectQuestion(@Param('id') id: string, @Request() req) {
    return this.adminService.rejectQuestion(+id, req.user.id);
  }

  @Post('ai-generator/create-question')
  @ApiOperation({ summary: 'Generar pregunta usando IA' })
  @ApiResponse({ status: 201, description: 'Pregunta generada' })
  async generateQuestion(@Body() generateDto: GenerateQuestionDto, @Request() req) {
    return this.adminService.generateQuestionWithAI(generateDto, req.user.id);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Obtener reportes de preguntas' })
  async getReports() {
    return this.adminService.getReports();
  }

  @Patch('reports/:id')
  @ApiOperation({ summary: 'Actualizar estado de reporte' })
  async updateReportStatus(
    @Param('id') id: string,
    @Body() body: { estado: EstadoReporte },
  ) {
    return this.adminService.updateReportStatus(+id, body.estado);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Crear categoría' })
  async createCategory(@Body() body: { nombre: string; descripcion?: string }) {
    return this.adminService.createCategory(body.nombre, body.descripcion);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { nombre?: string; descripcion?: string; activo?: boolean },
  ) {
    return this.adminService.updateCategory(+id, body.nombre, body.descripcion, body.activo);
  }

  @Post('questions/upload-excel')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir preguntas desde archivo Excel' })
  @ApiResponse({ status: 200, description: 'Archivo procesado' })
  async uploadExcel(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.adminService.processExcelFile(file, req.user.id);
  }
}

