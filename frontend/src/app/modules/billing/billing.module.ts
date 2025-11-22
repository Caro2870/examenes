import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingRoutingModule } from './billing-routing.module';
import { BillingComponent } from './components/billing/billing.component';
import { BillingService } from './services/billing.service';

@NgModule({
  declarations: [BillingComponent],
  imports: [CommonModule, BillingRoutingModule],
  providers: [BillingService],
})
export class BillingModule {}

