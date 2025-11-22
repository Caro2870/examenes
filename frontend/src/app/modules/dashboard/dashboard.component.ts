import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container">
      <h1>Dashboard</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Exámenes Completados</h3>
          <p class="stat-number">{{ stats?.examenes_completados || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Preguntas Respondidas</h3>
          <p class="stat-number">{{ stats?.preguntas_respondidas || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Promedio</h3>
          <p class="stat-number">{{ stats?.promedio || 0 }}%</p>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-primary" routerLink="/exam/start">Iniciar Examen</button>
        <button class="btn btn-secondary" routerLink="/questions">Ver Banco de Preguntas</button>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-number {
      font-size: 36px;
      font-weight: bold;
      color: #007bff;
      margin-top: 10px;
    }
    .actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }
  `],
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  currentUser: any = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    // Aquí se cargarían las estadísticas reales
    this.stats = {
      examenes_completados: 0,
      preguntas_respondidas: 0,
      promedio: 0,
    };
  }
}

