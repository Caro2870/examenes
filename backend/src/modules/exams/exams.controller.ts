import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { StartExamDto } from './dto/start-exam.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exam')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Iniciar un nuevo examen' })
  @ApiResponse({ status: 201, description: 'Examen iniciado' })
  async startExam(@Body() startExamDto: StartExamDto, @Request() req) {
    return this.examsService.startExam(req.user.id, startExamDto);
  }

  @Post('answer')
  @ApiOperation({ summary: 'Responder una pregunta del examen' })
  @ApiResponse({ status: 200, description: 'Respuesta registrada' })
  async answerQuestion(
    @Body() answerDto: AnswerQuestionDto,
    @Request() req,
  ) {
    return this.examsService.answerQuestion(
      answerDto.examen_id,
      answerDto.pregunta_id,
      answerDto,
      req.user.id,
    );
  }

  @Post('finish/:id')
  @ApiOperation({ summary: 'Finalizar examen y obtener resultados' })
  @ApiResponse({ status: 200, description: 'Examen finalizado' })
  async finishExam(@Param('id') id: string, @Request() req) {
    return this.examsService.finishExam(+id, req.user.id);
  }

  @Get('results/:id')
  @ApiOperation({ summary: 'Obtener resultados de un examen' })
  @ApiResponse({ status: 200, description: 'Resultados del examen' })
  async getResults(@Param('id') id: string, @Request() req) {
    return this.examsService.getResults(+id, req.user.id);
  }

  @Get('my-exams')
  @ApiOperation({ summary: 'Obtener mis exámenes' })
  async getMyExams(@Request() req) {
    return this.examsService.getUserExams(req.user.id);
  }
}

