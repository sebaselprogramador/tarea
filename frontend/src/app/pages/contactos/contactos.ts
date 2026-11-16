import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, InfoClinica } from '../../services/api.service';

@Component({
  selector: 'app-contactos',
  imports: [ReactiveFormsModule],
  template: `
    <section class="contenedor">
      <h1 class="titulo">Contactos</h1>
      <div class="dos-columnas">
        <aside class="tarjeta">
          <h3>Datos de la clinica</h3>
          @if (info(); as i) {
            <p><strong>Direccion:</strong> {{ i.direccion }}</p>
            <p><strong>Telefono:</strong> {{ i.telefono }}</p>
            <p><strong>Email:</strong> {{ i.email }}</p>
            <p><strong>Horario:</strong> {{ i.horario }}</p>
          }
        </aside>

        <form class="formulario" [formGroup]="form" (ngSubmit)="enviar()">
          <label>Nombre *
            <input formControlName="nombre" type="text" maxlength="120" />
          </label>
          <label>Correo electronico *
            <input formControlName="email" type="email" maxlength="120" />
          </label>
          <label>Telefono
            <input formControlName="telefono" type="tel" maxlength="50" />
          </label>
          <label>Asunto
            <input formControlName="asunto" type="text" maxlength="150" />
          </label>
          <label>Mensaje *
            <textarea formControlName="mensaje" rows="5" maxlength="2000"></textarea>
          </label>

          <button type="submit" class="btn" [disabled]="enviando()">
            {{ enviando() ? 'Enviando…' : 'Enviar mensaje' }}
          </button>

          @if (estado(); as e) {
            <p class="alerta" [class.error]="e.tipo === 'error'">{{ e.texto }}</p>
          }
        </form>
      </div>
    </section>
  `,
})
export class ContactosComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  info = signal<InfoClinica | null>(null);
  enviando = signal(false);
  estado = signal<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    asunto: [''],
    mensaje: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    this.api.getClinica().subscribe({ next: (i) => this.info.set(i), error: () => {} });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.estado.set(null);
    this.api.enviarContacto(this.form.getRawValue()).subscribe({
      next: (r) => {
        this.estado.set({ tipo: 'ok', texto: r.mensaje });
        this.form.reset();
        this.enviando.set(false);
      },
      error: (err) => {
        const detalle = err.error?.detalles?.join(' ') ?? 'No se pudo enviar el mensaje. Intenta nuevamente.';
        this.estado.set({ tipo: 'error', texto: detalle });
        this.enviando.set(false);
      },
    });
  }
}
