import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Comentario } from './comentario.entity';

export enum TipoVoto {
  POSITIVO = 'positivo',
  NEGATIVO = 'negativo',
}

@Entity('votos_comentarios')
@Unique(['usuario_id', 'comentario_id'])
export class VotoComentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ type: 'int' })
  comentario_id: number;

  @ManyToOne(() => Comentario, (comentario) => comentario.votos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comentario_id' })
  comentario: Comentario;

  @Column({ type: 'enum', enum: TipoVoto })
  tipo: TipoVoto;

  @CreateDateColumn()
  created_at: Date;
}

