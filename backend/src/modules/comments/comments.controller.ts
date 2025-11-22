import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { VoteCommentDto } from './dto/vote-comment.dto';
import { ReportQuestionDto } from './dto/report-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear comentario en una pregunta' })
  @ApiResponse({ status: 201, description: 'Comentario creado' })
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user.id);
  }

  @Get('question/:preguntaId')
  @ApiOperation({ summary: 'Obtener comentarios de una pregunta' })
  @ApiResponse({ status: 200, description: 'Lista de comentarios' })
  async findByQuestion(@Param('preguntaId') preguntaId: string) {
    return this.commentsService.findByQuestion(+preguntaId);
  }

  @Post('vote')
  @ApiOperation({ summary: 'Votar un comentario' })
  @ApiResponse({ status: 200, description: 'Voto registrado' })
  async vote(@Body() voteDto: VoteCommentDto, @Request() req) {
    return this.commentsService.vote(voteDto, req.user.id);
  }

  @Post('report-question')
  @ApiOperation({ summary: 'Reportar un error en una pregunta' })
  @ApiResponse({ status: 201, description: 'Reporte creado' })
  async reportQuestion(@Body() reportDto: ReportQuestionDto, @Request() req) {
    return this.commentsService.reportQuestion(reportDto, req.user.id);
  }
}
