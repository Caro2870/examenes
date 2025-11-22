import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo" (click)="goHome()">Exámenes Certificaciones</h1>
          <nav class="nav">
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/questions" routerLinkActive="active">Banco de Preguntas</a>
            <a routerLink="/exam" routerLinkActive="active">Exámenes</a>
            <a routerLink="/billing" routerLinkActive="active" *ngIf="isAuthenticated">Suscripciones</a>
            <a routerLink="/admin" routerLinkActive="active" *ngIf="isAdmin">Admin</a>
            <div class="user-menu" *ngIf="isAuthenticated">
              <span>{{ currentUser?.nombre }}</span>
              <button class="btn btn-secondary" (click)="logout()">Salir</button>
            </div>
            <a routerLink="/auth/login" *ngIf="!isAuthenticated">Iniciar Sesión</a>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 15px 0;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      cursor: pointer;
    }
    .nav {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .nav a {
      text-decoration: none;
      color: #333;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .nav a:hover, .nav a.active {
      background: #f0f0f0;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `],
})
export class HeaderComponent {
  isAuthenticated = false;
  currentUser: any = null;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
      this.isAdmin = user?.role === 'superadmin';
    });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

