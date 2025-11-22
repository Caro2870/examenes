import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="container">
      <h1>Panel de Administración</h1>
      <div class="admin-tabs">
        <button class="btn" [class.active]="activeTab === 'questions'" (click)="activeTab = 'questions'">
          Preguntas Pendientes
        </button>
        <button class="btn" [class.active]="activeTab === 'generate'" (click)="activeTab = 'generate'">
          Generar con IA
        </button>
        <button class="btn" [class.active]="activeTab === 'reports'" (click)="activeTab = 'reports'">
          Reportes
        </button>
      </div>
      <div class="admin-content">
        <div *ngIf="activeTab === 'questions'">
          <div *ngFor="let question of pendingQuestions" class="card">
            <h3>{{ question.texto }}</h3>
            <button class="btn btn-success" (click)="approve(question.id)">Aprobar</button>
            <button class="btn btn-danger" (click)="reject(question.id)">Rechazar</button>
          </div>
        </div>
        <div *ngIf="activeTab === 'generate'">
          <div class="card">
            <h3>Generar Pregunta con IA</h3>
            <form (ngSubmit)="generateQuestion()">
              <div class="form-group">
                <label>Categoría</label>
                <select [(ngModel)]="generateData.categoria_id" name="categoria">
                  <option *ngFor="let cat of categorias" [value]="cat.id">{{ cat.nombre }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Generar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  activeTab = 'questions';
  pendingQuestions: any[] = [];
  categorias: any[] = [];
  generateData: any = {};

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadPendingQuestions();
  }

  loadPendingQuestions() {
    this.adminService.getPendingQuestions().subscribe((data: any) => {
      this.pendingQuestions = data;
    });
  }

  approve(id: number) {
    this.adminService.approveQuestion(id).subscribe(() => {
      this.loadPendingQuestions();
    });
  }

  reject(id: number) {
    this.adminService.rejectQuestion(id).subscribe(() => {
      this.loadPendingQuestions();
    });
  }

  generateQuestion() {
    this.adminService.generateQuestion(this.generateData).subscribe(() => {
      this.loadPendingQuestions();
    });
  }
}

