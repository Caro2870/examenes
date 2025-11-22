import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlans(): Observable<any> {
    return this.http.get(`${this.apiUrl}/billing/plans`);
  }

  createStripeSubscription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/billing/stripe/subscribe`, data);
  }

  createPayPalSubscription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/billing/paypal/subscribe`, data);
  }

  cancelSubscription(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/billing/cancel/${id}`, {});
  }

  getMySubscriptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/billing/my-subscriptions`);
  }
}

