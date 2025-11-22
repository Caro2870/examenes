import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Pregunta } from './pregunta.entity';

export enum TipoReporte {
  ERROR = 'error',
  AMBIGUA = 'ambigua',
  DESACTUALIZADA = 'desactualizada',
  OTRO = 'otro',
}

export enum EstadoReporte {
  PENDIENTE = 'pendiente',
  REVISADO = 'revisado',
  RESUELTO = 'resuelto',
  DESCARTADO = 'descartado',
}

@Entity('reportes_preguntas')
export class ReportePregunta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ type: 'int' })
  pregunta_id: number;

  @ManyToOne(() => Pregunta)
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: Pregunta;

  @Column({ type: 'enum', enum: TipoReporte })
  tipo: TipoReporte;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'enum', enum: EstadoReporte, default: EstadoReporte.PENDIENTE })
  estado: EstadoReporte;

  @CreateDateColumn()
  created_at: Date;
}

