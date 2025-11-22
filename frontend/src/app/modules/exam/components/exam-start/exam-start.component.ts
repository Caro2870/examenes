import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-start',
  template: `
    <div class="container">
      <h1>Iniciar Examen</h1>
      <div class="card">
        <form (ngSubmit)="startExam()">
          <div class="form-group">
            <label>Número de preguntas</label>
            <select [(ngModel)]="numPreguntas" name="numPreguntas">
              <option value="10">10</option>
              <option value="20" selected>20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <div class="form-group">
            <label>Categoría (opcional)</label>
            <select [(ngModel)]="categoriaId" name="categoriaId">
              <option value="">Todas</option>
              <option *ngFor="let cat of categorias" [value]="cat.id">{{ cat.nombre }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Iniciando...' : 'Iniciar Examen' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class ExamStartComponent {
  numPreguntas = 20;
  categoriaId = '';
  categorias: any[] = [];
  loading = false;

  constructor(private examService: ExamService, private router: Router) {}

  startExam() {
    this.loading = true;
    const data: any = { num_preguntas: this.numPreguntas };
    if (this.categoriaId) data.categoria_id = +this.categoriaId;

    this.examService.startExam(data).subscribe({
      next: (response) => {
        this.router.navigate(['/exam', response.examen.id]);
      },
      error: (err) => {
        alert(err.error?.message || 'Error al iniciar examen');
        this.loading = false;
      },
    });
  }
}

