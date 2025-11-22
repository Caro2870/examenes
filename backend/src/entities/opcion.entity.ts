import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pregunta } from './pregunta.entity';

@Entity('opciones')
export class Opcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  texto: string;

  @Column({ type: 'boolean', default: false })
  es_correcta: boolean;

  @Column({ type: 'int' })
  pregunta_id: number;

  @ManyToOne(() => Pregunta, (pregunta) => pregunta.opciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: Pregunta;
}

