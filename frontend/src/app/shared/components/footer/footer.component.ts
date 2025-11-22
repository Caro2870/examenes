import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Plataforma de Exámenes. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 20px 0;
      margin-top: auto;
    }
  `],
})
export class FooterComponent {}

