import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-question-detail',
  template: `
    <div class="container">
      <div class="card" *ngIf="question">
        <h2>{{ question.texto }}</h2>
        <div class="question-info">
          <p><strong>Categoría:</strong> {{ question.categoria?.nombre }}</p>
          <p><strong>Nivel:</strong> {{ question.nivel?.nombre }}</p>
          <p><strong>Dificultad:</strong> {{ question.dificultad?.nombre }}</p>
        </div>
        <div class="options">
          <div *ngFor="let opcion of question.opciones" class="option">
            {{ opcion.texto }}
          </div>
        </div>
        <app-comments [preguntaId]="question.id"></app-comments>
      </div>
    </div>
  `,
})
export class QuestionDetailComponent implements OnInit {
  question: any = null;

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.questionsService.getQuestion(id).subscribe((data: any) => {
      this.question = data;
    });
  }
}

