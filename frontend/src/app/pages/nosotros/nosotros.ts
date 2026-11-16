import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService, Foto, InfoClinica } from '../../services/api.service';

@Component({
  selector: 'app-nosotros',
  template: `
    <section class="contenedor">
      <h1 class="titulo">Nosotros</h1>
      @if (info(); as i) {
        <div class="dos-columnas">
          <div>
            <h2>Nuestra historia</h2>
            <p>{{ i.historia }}</p>
            <h2>Mision</h2>
            <p>{{ i.mision }}</p>
          </div>
          <aside class="tarjeta">
            <h3>Visitanos</h3>
            <p><strong>Direccion:</strong> {{ i.direccion }}</p>
            <p><strong>Telefono:</strong> {{ i.telefono }}</p>
            <p><strong>Email:</strong> {{ i.email }}</p>
            <p><strong>Horario:</strong> {{ i.horario }}</p>
            @if (i.latitud && i.longitud) {
              <a class="btn-secundario" target="_blank" rel="noopener"
                 [href]="'https://www.openstreetmap.org/?mlat=' + i.latitud + '&mlon=' + i.longitud + '#map=17/' + i.latitud + '/' + i.longitud">
                Ver en el mapa
              </a>
            }
          </aside>
        </div>
      }

      <h2 class="titulo-sec">Nuestra tienda y clinica</h2>
      <div class="galeria">
        @for (f of galeria(); track f.id) {
          <figure>
            <img [src]="f.imagen_url" [alt]="f.titulo" loading="lazy" />
            <figcaption>{{ f.titulo }}</figcaption>
          </figure>
        } @empty {
          <p class="vacio">Sin fotos por ahora.</p>
        }
      </div>
    </section>
  `,
})
export class NosotrosComponent implements OnInit {
  private api = inject(ApiService);
  info = signal<InfoClinica | null>(null);
  galeria = signal<Foto[]>([]);

  ngOnInit(): void {
    this.api.getClinica().subscribe({ next: (i) => this.info.set(i), error: () => {} });
    this.api.getGaleria().subscribe({ next: (g) => this.galeria.set(g), error: () => {} });
  }
}
