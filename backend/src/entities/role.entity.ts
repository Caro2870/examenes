import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

export enum RoleType {
  SUPERADMIN = 'superadmin',
  SUSCRIPTOR = 'suscriptor',
  FREE = 'free',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RoleType, unique: true })
  nombre: RoleType;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}

