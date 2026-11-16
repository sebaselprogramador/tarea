import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService, Servicio } from '../../services/api.service';

@Component({
  selector: 'app-servicios',
  template: `
    <section class="contenedor">
      <h1 class="titulo">Servicios</h1>
      <p class="subtitulo">Todo lo que tu mascota necesita, en un solo lugar.</p>
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
    </section>
  `,
})
export class ServiciosComponent implements OnInit {
  private api = inject(ApiService);
  servicios = signal<Servicio[]>([]);

  ngOnInit(): void {
    this.api.getServicios().subscribe({ next: (s) => this.servicios.set(s), error: () => {} });
  }
}
