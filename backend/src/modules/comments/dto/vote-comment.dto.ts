import { IsInt, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoVoto } from '../../../entities/voto-comentario.entity';

export class VoteCommentDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  comentario_id: number;

  @ApiProperty({ enum: TipoVoto })
  @IsEnum(TipoVoto)
  @IsNotEmpty()
  tipo: TipoVoto;
}

