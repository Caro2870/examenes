import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Obtener planes disponibles' })
  async getPlans() {
    return this.billingService.getPlans();
  }

  @Post('stripe/subscribe')
  @ApiOperation({ summary: 'Crear suscripción con Stripe' })
  async createStripeSubscription(
    @Body() body: { plan_id: number; payment_method_id: string },
    @Request() req,
  ) {
    return this.billingService.createStripeSubscription(
      req.user.id,
      body.plan_id,
      body.payment_method_id,
    );
  }

  @Post('paypal/subscribe')
  @ApiOperation({ summary: 'Crear suscripción con PayPal' })
  async createPayPalSubscription(
    @Body() body: { plan_id: number },
    @Request() req,
  ) {
    return this.billingService.createPayPalSubscription(req.user.id, body.plan_id);
  }

  @Post('cancel/:id')
  @ApiOperation({ summary: 'Cancelar suscripción' })
  async cancelSubscription(@Param('id') id: string, @Request() req) {
    return this.billingService.cancelSubscription(req.user.id, +id);
  }

  @Get('my-subscriptions')
  @ApiOperation({ summary: 'Obtener mis suscripciones' })
  async getMySubscriptions(@Request() req) {
    return this.billingService.getUserSubscriptions(req.user.id);
  }
}

