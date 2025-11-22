import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-question-bank',
  template: `
    <div class="container">
      <h1>Banco de Preguntas</h1>
      <div class="filters card">
        <h3>Filtros</h3>
        <div class="filter-group">
          <label>Categoría</label>
          <select [(ngModel)]="filters.categoria_id">
            <option value="">Todas</option>
            <option *ngFor="let cat of categorias" [value]="cat.id">{{ cat.nombre }}</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="loadQuestions()">Filtrar</button>
      </div>
      <div class="questions-list">
        <div *ngFor="let question of questions" class="card question-item" (click)="viewQuestion(question.id)">
          <h3>{{ question.texto }}</h3>
          <p><strong>Categoría:</strong> {{ question.categoria?.nombre }}</p>
          <p><strong>Nivel:</strong> {{ question.nivel?.nombre }}</p>
          <p><strong>Dificultad:</strong> {{ question.dificultad?.nombre }}</p>
        </div>
      </div>
    </div>
  `,
})
export class QuestionBankComponent implements OnInit {
  questions: any[] = [];
  categorias: any[] = [];
  filters: any = {};

  constructor(private questionsService: QuestionsService, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
    this.loadQuestions();
  }

  loadCategories() {
    this.questionsService.getCategories().subscribe((data: any) => {
      this.categorias = data;
    });
  }

  loadQuestions() {
    this.questionsService.getQuestions(this.filters).subscribe((response: any) => {
      this.questions = response.data || [];
    });
  }

  viewQuestion(id: number) {
    this.router.navigate(['/questions', id]);
  }
}

