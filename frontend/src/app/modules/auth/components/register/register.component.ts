import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Registro</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" [(ngModel)]="nombre" required>
          </div>
          <div class="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" [(ngModel)]="apellido">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" [(ngModel)]="email" required>
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" [(ngModel)]="password" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>
          <p class="auth-link">
            ¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión aquí</a>
          </p>
        </form>
        <div class="error" *ngIf="error">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }
    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .auth-card h2 {
      margin-bottom: 20px;
      text-align: center;
    }
    .auth-link {
      text-align: center;
      margin-top: 15px;
    }
  `],
})
export class RegisterComponent {
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.register(this.email, this.password, this.nombre, this.apellido).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse';
        this.loading = false;
      },
    });
  }
}

