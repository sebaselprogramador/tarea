import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService, InfoClinica } from './services/api.service';
import { ChatbotComponent } from './components/chatbot/chatbot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatbotComponent],
  template: `
    <header class="navbar">
      <a routerLink="/" class="brand">🐾 {{ info()?.nombre ?? 'Veterinaria' }}</a>
      <button class="menu-btn" (click)="menuAbierto.set(!menuAbierto())" aria-label="Menu">☰</button>
      <nav [class.abierto]="menuAbierto()">
        <a routerLink="/" routerLinkActive="activo" [routerLinkActiveOptions]="{ exact: true }" (click)="menuAbierto.set(false)">Inicio</a>
        <a routerLink="/servicios" routerLinkActive="activo" (click)="menuAbierto.set(false)">Servicios</a>
        <a routerLink="/especialidades" routerLinkActive="activo" (click)="menuAbierto.set(false)">Especialidades</a>
        <a routerLink="/nosotros" routerLinkActive="activo" (click)="menuAbierto.set(false)">Nosotros</a>
        <a routerLink="/precios" routerLinkActive="activo" (click)="menuAbierto.set(false)">Precios</a>
        <a routerLink="/contactos" routerLinkActive="activo" (click)="menuAbierto.set(false)">Contactos</a>
      </nav>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer class="footer">
      <p>{{ info()?.nombre }} · {{ info()?.direccion }} · {{ info()?.telefono }}</p>
      <p class="pequeno">© {{ anio }} Todos los derechos reservados</p>
    </footer>

    <app-chatbot />
  `,
})
export class App implements OnInit {
  private api = inject(ApiService);
  info = signal<InfoClinica | null>(null);
  menuAbierto = signal(false);
  anio = new Date().getFullYear();

  ngOnInit(): void {
    this.api.getClinica().subscribe({ next: (d) => this.info.set(d), error: () => this.info.set(null) });
  }
}
