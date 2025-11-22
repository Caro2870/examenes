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
import { Role } from './role.entity';
import { Plan } from './plan.entity';
import { Suscripcion } from './suscripcion.entity';
import { Examen } from './examen.entity';
import { Comentario } from './comentario.entity';
import { ReportePregunta } from './reporte-pregunta.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido: string;

  @Column({ type: 'int' })
  role_id: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'int', nullable: true })
  plan_id: number;

  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ type: 'int', default: 0 })
  examenes_hoy: number;

  @Column({ type: 'int', default: 0 })
  preguntas_hoy: number;

  @Column({ type: 'date', nullable: true })
  ultimo_reseteo: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Suscripcion, (suscripcion) => suscripcion.usuario)
  suscripciones: Suscripcion[];

  @OneToMany(() => Examen, (examen) => examen.usuario)
  examenes: Examen[];

  @OneToMany(() => Comentario, (comentario) => comentario.usuario)
  comentarios: Comentario[];

  @OneToMany(() => ReportePregunta, (reporte) => reporte.usuario)
  reportes: ReportePregunta[];
}

