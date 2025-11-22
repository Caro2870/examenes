import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Plan } from './plan.entity';

export enum EstadoSuscripcion {
  ACTIVA = 'activa',
  CANCELADA = 'cancelada',
  EXPIRADA = 'expirada',
}

export enum MetodoPago {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

@Entity('suscripciones')
export class Suscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ type: 'int' })
  plan_id: number;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ type: 'enum', enum: EstadoSuscripcion, default: EstadoSuscripcion.ACTIVA })
  estado: EstadoSuscripcion;

  @Column({ type: 'enum', enum: MetodoPago })
  metodo_pago: MetodoPago;

  @Column({ type: 'varchar', length: 255, nullable: true })
  id_pago_externo: string;

  @Column({ type: 'timestamp' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp' })
  fecha_fin: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_cancelacion: Date;

  @Column({ type: 'boolean', default: true })
  renovacion_automatica: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

