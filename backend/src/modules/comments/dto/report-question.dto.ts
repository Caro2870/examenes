import { IsInt, IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoReporte } from '../../../entities/reporte-pregunta.entity';

export class ReportQuestionDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  pregunta_id: number;

  @ApiProperty({ enum: TipoReporte })
  @IsEnum(TipoReporte)
  @IsNotEmpty()
  tipo: TipoReporte;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}

