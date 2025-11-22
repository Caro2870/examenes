import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { Suscripcion } from '../../entities/suscripcion.entity';
import { Plan } from '../../entities/plan.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Suscripcion, Plan, User]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}

