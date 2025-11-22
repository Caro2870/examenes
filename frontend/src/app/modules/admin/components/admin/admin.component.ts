import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { QuestionsService } from '../../../question-bank/services/questions.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="container">
      <h1>Panel de Administración</h1>
      <div class="admin-tabs">
        <button class="btn" [class.active]="activeTab === 'questions'" (click)="activeTab = 'questions'">
          Preguntas Pendientes
        </button>
        <button class="btn" [class.active]="activeTab === 'generate-ai'" (click)="activeTab = 'generate-ai'">
          Generar con IA
        </button>
        <button class="btn" [class.active]="activeTab === 'create-manual'" (click)="activeTab = 'create-manual'">
          Crear Manualmente
        </button>
        <button class="btn" [class.active]="activeTab === 'upload-excel'" (click)="activeTab = 'upload-excel'">
          Importar desde Excel
        </button>
        <button class="btn" [class.active]="activeTab === 'reports'" (click)="activeTab = 'reports'">
          Reportes
        </button>
      </div>
      <div class="admin-content">
        <!-- Preguntas Pendientes -->
        <div *ngIf="activeTab === 'questions'">
          <h2>Preguntas Pendientes de Aprobación</h2>
          <div *ngIf="pendingQuestions.length === 0" class="card">
            <p>No hay preguntas pendientes</p>
          </div>
          <div *ngFor="let question of pendingQuestions" class="card">
            <h3>{{ question.texto }}</h3>
            <p><strong>Categoría:</strong> {{ question.categoria?.nombre }}</p>
            <p><strong>Nivel:</strong> {{ question.nivel?.nombre }}</p>
            <p><strong>Dificultad:</strong> {{ question.dificultad?.nombre }}</p>
            <div class="actions">
              <button class="btn btn-success" (click)="approve(question.id)">Aprobar</button>
              <button class="btn btn-danger" (click)="reject(question.id)">Rechazar</button>
            </div>
          </div>
        </div>

        <!-- Generar con IA -->
        <div *ngIf="activeTab === 'generate-ai'">
          <div class="card">
            <h2>Generar Pregunta con IA</h2>
            <form (ngSubmit)="generateQuestion()">
              <div class="form-group">
                <label>Categoría *</label>
                <select [(ngModel)]="generateData.categoria_id" name="categoria" required>
                  <option value="">Seleccione una categoría</option>
                  <option *ngFor="let cat of categorias" [value]="cat.id">{{ cat.nombre }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Nivel *</label>
                <select [(ngModel)]="generateData.nivel_id" name="nivel" required>
                  <option value="">Seleccione un nivel</option>
                  <option *ngFor="let nivel of niveles" [value]="nivel.id">{{ nivel.nombre }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Dificultad *</label>
                <select [(ngModel)]="generateData.dificultad_id" name="dificultad" required>
                  <option value="">Seleccione una dificultad</option>
                  <option *ngFor="let dif of dificultades" [value]="dif.id">{{ dif.nombre }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Generar Pregunta</button>
            </form>
          </div>
        </div>

        <!-- Crear Manualmente -->
        <div *ngIf="activeTab === 'create-manual'">
          <div class="card">
            <h2>Crear Pregunta Manualmente</h2>
            <form (ngSubmit)="createManualQuestion()">
              <div class="form-group">
                <label>Texto de la Pregunta *</label>
                <textarea [(ngModel)]="manualQuestion.texto" name="texto" rows="4" required></textarea>
              </div>
              <div class="form-group">
                <label>Explicación</label>
                <textarea [(ngModel)]="manualQuestion.explicacion" name="explicacion" rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Categoría *</label>
                  <select [(ngModel)]="manualQuestion.categoria_id" name="categoria" required>
                    <option value="">Seleccione una categoría</option>
                    <option *ngFor="let cat of categorias" [value]="cat.id">{{ cat.nombre }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Nivel *</label>
                  <select [(ngModel)]="manualQuestion.nivel_id" name="nivel" required>
                    <option value="">Seleccione un nivel</option>
                    <option *ngFor="let nivel of niveles" [value]="nivel.id">{{ nivel.nombre }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Dificultad *</label>
                  <select [(ngModel)]="manualQuestion.dificultad_id" name="dificultad" required>
                    <option value="">Seleccione una dificultad</option>
                    <option *ngFor="let dif of dificultades" [value]="dif.id">{{ dif.nombre }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Opciones de Respuesta *</label>
                <div *ngFor="let opcion of manualQuestion.opciones; let i = index" class="option-group">
                  <input type="text" [(ngModel)]="opcion.texto" [name]="'opcion_' + i" placeholder="Texto de la opción" required>
                  <label>
                    <input type="radio" [name]="'correcta'" [value]="i" (change)="setCorrectOption(i)">
                    Correcta
                  </label>
                  <button type="button" class="btn btn-sm btn-danger" (click)="removeOption(i)" *ngIf="manualQuestion.opciones.length > 2">Eliminar</button>
                </div>
                <button type="button" class="btn btn-sm btn-secondary" (click)="addOption()">Agregar Opción</button>
              </div>
              <button type="submit" class="btn btn-primary">Crear Pregunta</button>
            </form>
          </div>
        </div>

        <!-- Importar desde Excel -->
        <div *ngIf="activeTab === 'upload-excel'">
          <div class="card">
            <h2>Importar Preguntas desde Excel</h2>
            <p>Selecciona un archivo Excel (.xlsx) con las preguntas. El formato debe incluir: texto, explicación, categoría, nivel, dificultad y opciones.</p>
            <div class="form-group">
              <label>Archivo Excel</label>
              <input type="file" accept=".xlsx,.xls" (change)="onFileSelected($event)">
            </div>
            <button class="btn btn-primary" (click)="uploadExcel()" [disabled]="!selectedFile">
              Subir y Procesar
            </button>
          </div>
        </div>

        <!-- Reportes -->
        <div *ngIf="activeTab === 'reports'">
          <h2>Reportes de Preguntas</h2>
          <p>Funcionalidad de reportes en desarrollo</p>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  activeTab = 'questions';
  pendingQuestions: any[] = [];
  categorias: any[] = [];
  niveles: any[] = [];
  dificultades: any[] = [];
  generateData: any = {
    categoria_id: null,
    nivel_id: null,
    dificultad_id: null,
  };
  manualQuestion: any = {
    texto: '',
    explicacion: '',
    categoria_id: null,
    nivel_id: null,
    dificultad_id: null,
    opciones: [
      { texto: '', es_correcta: false },
      { texto: '', es_correcta: false },
      { texto: '', es_correcta: false },
      { texto: '', es_correcta: false },
    ],
  };
  selectedFile: File | null = null;

  constructor(
    private adminService: AdminService,
    private questionsService: QuestionsService,
  ) {}

  ngOnInit() {
    this.loadPendingQuestions();
    this.loadCategories();
    this.loadNiveles();
    this.loadDificultades();
  }

  loadPendingQuestions() {
    this.adminService.getPendingQuestions().subscribe((data: any) => {
      this.pendingQuestions = data;
    });
  }

  loadCategories() {
    this.adminService.getCategories().subscribe((data: any) => {
      this.categorias = data;
    });
  }

  loadNiveles() {
    this.questionsService.getNiveles().subscribe((data: any) => {
      this.niveles = data;
    });
  }

  loadDificultades() {
    this.questionsService.getDificultades().subscribe((data: any) => {
      this.dificultades = data;
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
    if (!this.generateData.categoria_id || !this.generateData.nivel_id || !this.generateData.dificultad_id) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    // Convertir los IDs a números
    const generateData = {
      categoria_id: parseInt(this.generateData.categoria_id, 10),
      nivel_id: parseInt(this.generateData.nivel_id, 10),
      dificultad_id: parseInt(this.generateData.dificultad_id, 10),
    };
    
    this.adminService.generateQuestion(generateData).subscribe({
      next: () => {
        alert('Pregunta generada exitosamente');
        this.loadPendingQuestions();
        this.generateData = {
          categoria_id: null,
          nivel_id: null,
          dificultad_id: null,
        };
      },
      error: (err) => {
        alert(err.error?.message || 'Error al generar pregunta');
      },
    });
  }

  addOption() {
    this.manualQuestion.opciones.push({ texto: '', es_correcta: false });
  }

  removeOption(index: number) {
    if (this.manualQuestion.opciones.length > 2) {
      this.manualQuestion.opciones.splice(index, 1);
    }
  }

  setCorrectOption(index: number) {
    this.manualQuestion.opciones.forEach((opcion: any, idx: number) => {
      opcion.es_correcta = idx === index;
    });
  }

  createManualQuestion() {
    // Validar que haya exactamente una opción correcta
    const correctas = this.manualQuestion.opciones.filter((op: any) => op.es_correcta);
    if (correctas.length !== 1) {
      alert('Debe haber exactamente una opción correcta');
      return;
    }

    // Validar que todos los campos obligatorios estén completos
    if (!this.manualQuestion.texto || !this.manualQuestion.texto.trim()) {
      alert('Por favor ingresa el texto de la pregunta');
      return;
    }

    if (!this.manualQuestion.categoria_id || this.manualQuestion.categoria_id === '' || this.manualQuestion.categoria_id === null) {
      alert('Por favor selecciona una categoría');
      return;
    }

    if (!this.manualQuestion.nivel_id || this.manualQuestion.nivel_id === '' || this.manualQuestion.nivel_id === null) {
      alert('Por favor selecciona un nivel');
      return;
    }

    if (!this.manualQuestion.dificultad_id || this.manualQuestion.dificultad_id === '' || this.manualQuestion.dificultad_id === null) {
      alert('Por favor selecciona una dificultad');
      return;
    }

    // Validar que todas las opciones tengan texto
    const opcionesVacias = this.manualQuestion.opciones.filter((op: any) => !op.texto || !op.texto.trim());
    if (opcionesVacias.length > 0) {
      alert('Por favor completa el texto de todas las opciones');
      return;
    }

    // Convertir los IDs a números
    const questionData = {
      texto: this.manualQuestion.texto.trim(),
      explicacion: this.manualQuestion.explicacion?.trim() || '',
      categoria_id: parseInt(this.manualQuestion.categoria_id, 10),
      nivel_id: parseInt(this.manualQuestion.nivel_id, 10),
      dificultad_id: parseInt(this.manualQuestion.dificultad_id, 10),
      opciones: this.manualQuestion.opciones.map((op: any) => ({
        texto: op.texto.trim(),
        es_correcta: op.es_correcta,
      })),
    };

    this.adminService.createQuestion(questionData).subscribe({
      next: () => {
        alert('Pregunta creada exitosamente');
        this.manualQuestion = {
          texto: '',
          explicacion: '',
          categoria_id: null,
          nivel_id: null,
          dificultad_id: null,
          opciones: [
            { texto: '', es_correcta: false },
            { texto: '', es_correcta: false },
            { texto: '', es_correcta: false },
            { texto: '', es_correcta: false },
          ],
        };
      },
      error: (err) => {
        alert(err.error?.message || 'Error al crear pregunta');
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadExcel() {
    if (!this.selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    this.adminService.uploadExcel(this.selectedFile).subscribe({
      next: (response) => {
        alert(`Archivo procesado: ${response.message || 'Éxito'}`);
        this.selectedFile = null;
        this.loadPendingQuestions();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al procesar archivo');
      },
    });
  }
}
