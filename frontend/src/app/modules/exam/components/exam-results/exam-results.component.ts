import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-results',
  template: `
    <div class="container">
      <h1>Resultados del Examen</h1>
      <div class="card" *ngIf="results">
        <div class="results-summary">
          <h2>Puntaje: {{ results.examen.puntaje }}%</h2>
          <p>Aciertos: {{ results.examen.aciertos }} / {{ results.examen.total_preguntas }}</p>
          <p>Tiempo: {{ formatTime(results.examen.tiempo_segundos) }}</p>
        </div>
        <div class="results-detail">
          <h3>Detalle de Respuestas</h3>
          <div *ngFor="let resultado of results.resultados" class="result-item" [class.correct]="resultado.es_correcta" [class.incorrect]="!resultado.es_correcta">
            <p><strong>{{ resultado.pregunta.texto }}</strong></p>
            <p class="explanation" *ngIf="resultado.pregunta.explicacion">{{ resultado.pregunta.explicacion }}</p>
            <p>Tu respuesta: {{ resultado.respuesta_usuario?.texto || 'No respondida' }}</p>
            <p *ngIf="!resultado.es_correcta">
              Respuesta correcta: {{ getCorrectAnswer(resultado.pregunta.opciones) }}
            </p>
          </div>
        </div>
        <button class="btn btn-primary" routerLink="/exam/start">Hacer Otro Examen</button>
      </div>
    </div>
  `,
  styles: [`
    .results-summary {
      text-align: center;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .result-item {
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #ddd;
      border-radius: 4px;
    }
    .result-item.correct {
      border-left-color: #28a745;
      background: #d4edda;
    }
    .result-item.incorrect {
      border-left-color: #dc3545;
      background: #f8d7da;
    }
    .explanation {
      font-style: italic;
      color: #666;
      margin: 10px 0;
    }
  `],
})
export class ExamResultsComponent implements OnInit {
  results: any = null;

  constructor(private route: ActivatedRoute, private examService: ExamService) {}

  ngOnInit() {
    const examId = +this.route.snapshot.params['id'];
    this.examService.getResults(examId).subscribe({
      next: (response) => {
        this.results = response;
      },
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getCorrectAnswer(opciones: any[]): string {
    const correct = opciones.find(op => op.es_correcta);
    return correct?.texto || '';
  }
}

