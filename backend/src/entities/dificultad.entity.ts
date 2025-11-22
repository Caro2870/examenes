import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pregunta } from './pregunta.entity';

export enum DificultadType {
  FACIL = 'fácil',
  MEDIO = 'medio',
  DIFICIL = 'difícil',
}

@Entity('dificultades')
export class Dificultad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DificultadType, unique: true })
  nombre: DificultadType;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.dificultad)
  preguntas: Pregunta[];
}

