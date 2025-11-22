import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role, RoleType } from '../../entities/role.entity';
import { Plan } from '../../entities/plan.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const freeRole = await this.roleRepository.findOne({
      where: { nombre: RoleType.FREE },
    });

    if (!freeRole) {
      throw new NotFoundException('Rol free no encontrado');
    }

    const freePlan = await this.planRepository.findOne({
      where: { tipo: 'free' },
    });

    const user = this.userRepository.create({
      ...createUserDto,
      role_id: freeRole.id,
      plan_id: freePlan?.id || null,
      ultimo_reseteo: new Date(),
    });

    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'plan'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role', 'plan'],
    });
  }

  async resetDailyLimits(userId: number): Promise<void> {
    const user = await this.findOne(userId);
    const today = new Date();
    const lastReset = user.ultimo_reseteo ? new Date(user.ultimo_reseteo) : null;

    if (!lastReset || today.toDateString() !== lastReset.toDateString()) {
      await this.userRepository.update(userId, {
        examenes_hoy: 0,
        preguntas_hoy: 0,
        ultimo_reseteo: today,
      });
    }
  }

  async checkDailyLimit(userId: number, limitType: 'examenes' | 'preguntas'): Promise<boolean> {
    await this.resetDailyLimits(userId);
    const user = await this.findOne(userId);

    if (user.plan?.acceso_completo) {
      return true;
    }

    const limit = limitType === 'examenes' 
      ? user.plan?.limite_examenes_diarios || 0
      : user.plan?.limite_preguntas_diarias || 0;

    const current = limitType === 'examenes' 
      ? user.examenes_hoy 
      : user.preguntas_hoy;

    return current < limit;
  }

  async incrementDailyCount(userId: number, limitType: 'examenes' | 'preguntas'): Promise<void> {
    await this.resetDailyLimits(userId);
    const user = await this.findOne(userId);

    if (limitType === 'examenes') {
      await this.userRepository.increment({ id: userId }, 'examenes_hoy', 1);
    } else {
      await this.userRepository.increment({ id: userId }, 'preguntas_hoy', 1);
    }
  }
}

