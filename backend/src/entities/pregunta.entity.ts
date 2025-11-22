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
import { Categoria } from './categoria.entity';
import { Nivel } from './nivel.entity';
import { Dificultad } from './dificultad.entity';
import { Opcion } from './opcion.entity';
import { ExamenPregunta } from './examen-pregunta.entity';
import { Comentario } from './comentario.entity';
import { ReportePregunta } from './reporte-pregunta.entity';

export enum EstadoPregunta {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
}

@Entity('preguntas')
export class Pregunta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  texto: string;

  @Column({ type: 'text', nullable: true })
  explicacion: string;

  @Column({ type: 'int' })
  categoria_id: number;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ type: 'int' })
  nivel_id: number;

  @ManyToOne(() => Nivel)
  @JoinColumn({ name: 'nivel_id' })
  nivel: Nivel;

  @Column({ type: 'int' })
  dificultad_id: number;

  @ManyToOne(() => Dificultad)
  @JoinColumn({ name: 'dificultad_id' })
  dificultad: Dificultad;

  @Column({ type: 'enum', enum: EstadoPregunta, default: EstadoPregunta.PENDIENTE })
  estado: EstadoPregunta;

  @Column({ type: 'int', nullable: true })
  aprobado_por_id: number;

  @Column({ type: 'boolean', default: false })
  generada_ia: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Opcion, (opcion) => opcion.pregunta, { cascade: true })
  opciones: Opcion[];

  @OneToMany(() => ExamenPregunta, (examenPregunta) => examenPregunta.pregunta)
  examenPreguntas: ExamenPregunta[];

  @OneToMany(() => Comentario, (comentario) => comentario.pregunta)
  comentarios: Comentario[];

  @OneToMany(() => ReportePregunta, (reporte) => reporte.pregunta)
  reportes: ReportePregunta[];
}

