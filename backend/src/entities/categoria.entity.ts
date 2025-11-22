import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pregunta } from './pregunta.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icono: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.categoria)
  preguntas: Pregunta[];
}

