import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService, Precio } from '../../services/api.service';

@Component({
  selector: 'app-precios',
  imports: [DecimalPipe],
  template: `
    <section class="contenedor">
      <h1 class="titulo">Precios</h1>
      <p class="subtitulo">Precios referenciales; pueden variar segun el caso.</p>
      <div class="tabla-wrap">
        <table class="tabla">
          <thead>
            <tr><th>Servicio</th><th>Concepto</th><th>Detalle</th><th class="derecha">Precio</th></tr>
          </thead>
          <tbody>
            @for (p of precios(); track p.id) {
              <tr>
                <td>{{ p.servicio ?? '—' }}</td>
                <td>{{ p.concepto }}</td>
                <td>{{ p.descripcion }}</td>
                <td class="derecha precio">{{ p.monto | number: '1.2-2' }} {{ p.moneda }}</td>
              </tr>
            } @empty {
              <tr><td colspan="4" class="vacio">Cargando precios…</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class PreciosComponent implements OnInit {
  private api = inject(ApiService);
  precios = signal<Precio[]>([]);

  ngOnInit(): void {
    this.api.getPrecios().subscribe({ next: (p) => this.precios.set(p), error: () => {} });
  }
}
