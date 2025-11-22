import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../services/billing.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
  plans: any[] = [];

  constructor(private billingService: BillingService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.billingService.getPlans().subscribe((data: any) => {
      this.plans = data;
    });
  }

  subscribe(planId: number) {
    // Implementar lógica de suscripción
    alert('Funcionalidad de suscripción en desarrollo');
  }
}
