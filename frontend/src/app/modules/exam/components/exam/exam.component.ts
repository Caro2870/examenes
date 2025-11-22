import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam',
  template: `
    <div class="container">
      <div class="exam-header">
        <h2>Examen en Progreso</h2>
        <div class="progress-bar">
          <div class="progress" [style.width.%]="progress"></div>
        </div>
        <p>Pregunta {{ currentIndex + 1 }} de {{ totalPreguntas }}</p>
      </div>
      <div class="card" *ngIf="currentQuestion">
        <h3>{{ currentQuestion.texto }}</h3>
        <div class="options">
          <label *ngFor="let opcion of currentQuestion.opciones" class="option">
            <input type="radio" [value]="opcion.id" [(ngModel)]="selectedOption" name="option">
            {{ opcion.texto }}
          </label>
        </div>
        <div class="exam-actions">
          <button class="btn btn-secondary" (click)="previousQuestion()" [disabled]="currentIndex === 0">
            Anterior
          </button>
          <button class="btn btn-primary" (click)="nextQuestion()" *ngIf="currentIndex < totalPreguntas - 1">
            Siguiente
          </button>
          <button class="btn btn-success" (click)="finishExam()" *ngIf="currentIndex === totalPreguntas - 1">
            Finalizar Examen
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-bar {
      width: 100%;
      height: 20px;
      background: #f0f0f0;
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress {
      height: 100%;
      background: #007bff;
      transition: width 0.3s;
    }
    .options {
      margin: 20px 0;
    }
    .option {
      display: block;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
    .option:hover {
      background: #f9f9f9;
    }
    .exam-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `],
})
export class ExamComponent implements OnInit {
  examId: number = 0;
  exam: any = null;
  currentIndex = 0;
  selectedOption: number | null = null;
  answers: Map<number, number> = new Map();

  get currentQuestion() {
    return this.exam?.preguntas[this.currentIndex];
  }

  get totalPreguntas() {
    return this.exam?.preguntas?.length || 0;
  }

  get progress() {
    return ((this.currentIndex + 1) / this.totalPreguntas) * 100;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
  ) {}

  ngOnInit() {
    this.examId = +this.route.snapshot.params['id'];
    this.loadExam();
  }

  loadExam() {
    // El examen ya fue iniciado, solo necesitamos obtener sus datos
    // En una implementación real, necesitaríamos un endpoint GET /exam/:id
    // Por ahora usamos getResults que funciona para exámenes completados
    // Para exámenes en progreso, necesitaríamos modificar el backend
    this.examService.getResults(this.examId).subscribe({
      next: (response) => {
        // Si el examen está en progreso, response.examen contendrá los datos
        if (response.examen) {
          this.exam = {
            examen: response.examen,
            preguntas: response.resultados?.map((r: any) => r.pregunta) || [],
          };
        } else {
          this.exam = response;
        }
      },
      error: (err) => {
        alert('Error al cargar examen. Asegúrate de que el examen existe.');
      },
    });
  }

  nextQuestion() {
    this.saveAnswer();
    if (this.currentIndex < this.totalPreguntas - 1) {
      this.currentIndex++;
      this.selectedOption = this.answers.get(this.currentQuestion.id) || null;
    }
  }

  previousQuestion() {
    this.saveAnswer();
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selectedOption = this.answers.get(this.currentQuestion.id) || null;
    }
  }

  saveAnswer() {
    if (this.selectedOption && this.currentQuestion) {
      this.answers.set(this.currentQuestion.id, this.selectedOption);
      this.examService.answerQuestion({
        examen_id: this.examId,
        pregunta_id: this.currentQuestion.id,
        opcion_id: this.selectedOption,
      }).subscribe();
    }
  }

  finishExam() {
    this.saveAnswer();
    this.examService.finishExam(this.examId).subscribe({
      next: () => {
        this.router.navigate(['/exam/results', this.examId]);
      },
      error: (err) => {
        alert('Error al finalizar examen');
      },
    });
  }
}

