import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pregunta } from './pregunta.entity';

export enum NivelType {
  BASICO = 'básico',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
}

@Entity('niveles')
export class Nivel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: NivelType, unique: true })
  nombre: NivelType;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.nivel)
  preguntas: Pregunta[];
}

