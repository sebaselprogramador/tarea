import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService, Especialidad } from '../../services/api.service';

@Component({
  selector: 'app-especialidades',
  template: `
    <section class="contenedor">
      <h1 class="titulo">Especialidades</h1>
      <p class="subtitulo">Profesionales capacitados para cada necesidad.</p>
      <div class="grid">
        @for (e of especialidades(); track e.id) {
          <article class="tarjeta">
            @if (e.imagen_url) {
              <img [src]="e.imagen_url" [alt]="e.nombre" loading="lazy" />
            }
            <h3>{{ e.nombre }}</h3>
            <p>{{ e.descripcion }}</p>
          </article>
        } @empty {
          <p class="vacio">Cargando especialidades…</p>
        }
      </div>
    </section>
  `,
})
export class EspecialidadesComponent implements OnInit {
  private api = inject(ApiService);
  especialidades = signal<Especialidad[]>([]);

  ngOnInit(): void {
    this.api.getEspecialidades().subscribe({ next: (e) => this.especialidades.set(e), error: () => {} });
  }
}
