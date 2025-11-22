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
import { Pregunta } from './pregunta.entity';
import { Opcion } from './opcion.entity';
import { VotoComentario } from './voto-comentario.entity';

@Entity('comentarios')
export class Comentario {
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

  @Column({ type: 'text' })
  texto: string;

  @Column({ type: 'int', nullable: true })
  opcion_propuesta_id: number;

  @ManyToOne(() => Opcion, { nullable: true })
  @JoinColumn({ name: 'opcion_propuesta_id' })
  opcion_propuesta: Opcion;

  @Column({ type: 'int', default: 0 })
  votos_positivos: number;

  @Column({ type: 'int', default: 0 })
  votos_negativos: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => VotoComentario, (voto) => voto.comentario)
  votos: VotoComentario[];
}

