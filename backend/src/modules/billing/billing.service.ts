import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suscripcion, EstadoSuscripcion, MetodoPago } from '../../entities/suscripcion.entity';
import { Plan } from '../../entities/plan.entity';
import { User } from '../../entities/user.entity';
import Stripe from 'stripe';
import * as paypal from 'paypal-rest-sdk';

@Injectable()
export class BillingService {
  private stripe: Stripe;
  private paypalConfigured: boolean = false;

  constructor(
    @InjectRepository(Suscripcion)
    private suscripcionRepository: Repository<Suscripcion>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    }

    const paypalClientId = process.env.PAYPAL_CLIENT_ID;
    const paypalSecret = process.env.PAYPAL_SECRET;
    if (paypalClientId && paypalSecret) {
      paypal.configure({
        mode: process.env.PAYPAL_MODE || 'sandbox',
        client_id: paypalClientId,
        client_secret: paypalSecret,
      });
      this.paypalConfigured = true;
    }
  }

  async getPlans() {
    return this.planRepository.find({ where: { activo: true } });
  }

  async createStripeSubscription(userId: number, planId: number, paymentMethodId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const plan = await this.planRepository.findOne({ where: { id: planId } });

    if (!user || !plan) {
      throw new NotFoundException('Usuario o plan no encontrado');
    }

    if (!this.stripe) {
      throw new Error('Stripe no configurado');
    }

    // Crear customer en Stripe
    const customer = await this.stripe.customers.create({
      email: user.email,
      payment_method: paymentMethodId,
    });

    // Crear suscripción
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price_data: {
        currency: plan.moneda || 'usd',
        product_data: { name: plan.nombre },
        unit_amount: Math.round(parseFloat(plan.precio.toString()) * 100),
        recurring: { interval: 'month' },
      } }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Crear registro en BD
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);

    const suscripcion = this.suscripcionRepository.create({
      usuario_id: userId,
      plan_id: planId,
      metodo_pago: MetodoPago.STRIPE,
      id_pago_externo: subscription.id,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado: EstadoSuscripcion.ACTIVA,
    });

    await this.suscripcionRepository.save(suscripcion);

    // Actualizar plan del usuario
    await this.userRepository.update(userId, { plan_id: planId });

    return {
      subscription_id: subscription.id,
      client_secret: (subscription.latest_invoice as any).payment_intent.client_secret,
    };
  }

  async createPayPalSubscription(userId: number, planId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const plan = await this.planRepository.findOne({ where: { id: planId } });

    if (!user || !plan) {
      throw new NotFoundException('Usuario o plan no encontrado');
    }

    if (!this.paypalConfigured) {
      throw new Error('PayPal no configurado');
    }

    // Crear billing plan en PayPal
    const billingPlan = {
      name: plan.nombre,
      description: plan.descripcion || '',
      type: 'INFINITE',
      payment_definitions: [{
        name: 'Regular payment',
        type: 'REGULAR',
        frequency: 'Month',
        frequency_interval: '1',
        amount: {
          currency: plan.moneda || 'USD',
          value: plan.precio.toString(),
        },
        cycles: '0',
      }],
      merchant_preferences: {
        return_url: `${process.env.FRONTEND_URL}/billing/success`,
        cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,
      },
    };

    return new Promise((resolve, reject) => {
      paypal.billingPlan.create(billingPlan, (error, plan) => {
        if (error) {
          reject(error);
        } else {
          resolve(plan);
        }
      });
    });
  }

  async cancelSubscription(userId: number, subscriptionId: number) {
    const suscripcion = await this.suscripcionRepository.findOne({
      where: { id: subscriptionId, usuario_id: userId },
    });

    if (!suscripcion) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    if (suscripcion.metodo_pago === MetodoPago.STRIPE && this.stripe) {
      await this.stripe.subscriptions.cancel(suscripcion.id_pago_externo);
    }

    suscripcion.estado = EstadoSuscripcion.CANCELADA;
    suscripcion.fecha_cancelacion = new Date();
    await this.suscripcionRepository.save(suscripcion);

    // Revertir a plan free
    const freePlan = await this.planRepository.findOne({ where: { tipo: 'free' } });
    if (freePlan) {
      await this.userRepository.update(userId, { plan_id: freePlan.id });
    }

    return { message: 'Suscripción cancelada exitosamente' };
  }

  async getUserSubscriptions(userId: number) {
    return this.suscripcionRepository.find({
      where: { usuario_id: userId },
      relations: ['plan'],
      order: { created_at: 'DESC' },
    });
  }
}

