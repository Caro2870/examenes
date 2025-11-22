import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Categoria } from './categoria.entity';
import { ExamenPregunta } from './examen-pregunta.entity';

export enum EstadoExamen {
  EN_PROGRESO = 'en_progreso',
  COMPLETADO = 'completado',
  ABANDONADO = 'abandonado',
}

@Entity('examenes')
export class Examen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ type: 'int', nullable: true })
  categoria_id: number;

  @ManyToOne(() => Categoria, { nullable: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ type: 'enum', enum: EstadoExamen, default: EstadoExamen.EN_PROGRESO })
  estado: EstadoExamen;

  @Column({ type: 'int', default: 0 })
  puntaje: number;

  @Column({ type: 'int', default: 0 })
  total_preguntas: number;

  @Column({ type: 'int', default: 0 })
  aciertos: number;

  @Column({ type: 'int', default: 0 })
  errores: number;

  @Column({ type: 'int', default: 0 })
  tiempo_segundos: number;

  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ExamenPregunta, (examenPregunta) => examenPregunta.examen, { cascade: true })
  examenPreguntas: ExamenPregunta[];
}

