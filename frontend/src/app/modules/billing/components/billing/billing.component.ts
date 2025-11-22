import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../services/billing.service';

@Component({
  selector: 'app-billing',
  template: `
    <div class="container">
      <h1>Suscripciones</h1>
      <div class="plans-grid">
        <div *ngFor="let plan of plans" class="card plan-card">
          <h3>{{ plan.nombre }}</h3>
          <p class="price">${{ plan.precio }}/mes</p>
          <p>{{ plan.descripcion }}</p>
          <button class="btn btn-primary" (click)="subscribe(plan.id)">Suscribirse</button>
        </div>
      </div>
    </div>
  `,
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

