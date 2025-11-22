import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Examen } from './examen.entity';
import { Pregunta } from './pregunta.entity';
import { Opcion } from './opcion.entity';

@Entity('examen_pregunta')
export class ExamenPregunta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  examen_id: number;

  @ManyToOne(() => Examen, (examen) => examen.examenPreguntas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examen_id' })
  examen: Examen;

  @Column({ type: 'int' })
  pregunta_id: number;

  @ManyToOne(() => Pregunta)
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: Pregunta;

  @Column({ type: 'int', nullable: true })
  opcion_seleccionada_id: number;

  @ManyToOne(() => Opcion, { nullable: true })
  @JoinColumn({ name: 'opcion_seleccionada_id' })
  opcion_seleccionada: Opcion;

  @Column({ type: 'boolean', nullable: true })
  es_correcta: boolean;

  @Column({ type: 'int', default: 0 })
  tiempo_segundos: number;
}

