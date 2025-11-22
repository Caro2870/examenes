import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Suscripcion } from './suscripcion.entity';

export enum PlanType {
  FREE = 'free',
  PREMIUM = 'premium',
}

@Entity('planes')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'enum', enum: PlanType })
  tipo: PlanType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  moneda: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int', default: 0 })
  limite_examenes_diarios: number;

  @Column({ type: 'int', default: 0 })
  limite_preguntas_diarias: number;

  @Column({ type: 'boolean', default: true })
  acceso_completo: boolean;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => Suscripcion, (suscripcion) => suscripcion.plan)
  suscripciones: Suscripcion[];
}

