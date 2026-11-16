import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Multimedia, Servicio } from '../../services/api.service';

// Inicio: video en bucle de animales (Pexels) + resumen de servicios
@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  template: `
    <section class="hero">
      @if (video(); as v) {
        <video class="hero-video" [src]="v.url" autoplay muted loop playsinline preload="auto"></video>
      }
      <div class="hero-overlay">
        <h1>Cuidamos a tu mascota como a la nuestra</h1>
        <p>Consultas, vacunas, cirugias y mucho carino en un solo lugar.</p>
        <a routerLink="/contactos" class="btn">Agenda una cita</a>
      </div>
      @if (video()?.fuente; as fuente) {
        <span class="credito">Video: {{ fuente }}</span>
      }
    </section>

    <section class="contenedor">
      <h2 class="titulo">Nuestros servicios</h2>
      <div class="grid">
        @for (s of servicios(); track s.id) {
          <article class="tarjeta">
            <div class="icono">{{ s.icono }}</div>
            <h3>{{ s.nombre }}</h3>
            <p>{{ s.descripcion }}</p>
          </article>
        } @empty {
          <p class="vacio">Cargando servicios…</p>
        }
      </div>
      <p class="centro"><a routerLink="/servicios" class="btn-secundario">Ver todos los servicios</a></p>
    </section>
  `,
})
export class InicioComponent implements OnInit {
  private api = inject(ApiService);
  video = signal<Multimedia | null>(null);
  servicios = signal<Servicio[]>([]);

  ngOnInit(): void {
    this.api.getMultimedia('hero_video').subscribe({ next: (v) => this.video.set(v), error: () => this.video.set(null) });
    this.api.getServicios().subscribe({ next: (s) => this.servicios.set(s.slice(0, 6)), error: () => {} });
  }
}
