import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, MensajeChat } from '../../services/api.service';

// Chatbot flotante. Envia el historial al backend, que consulta Ollama (gemma3)
@Component({
  selector: 'app-chatbot',
  imports: [FormsModule],
  template: `
    <button class="chat-toggle" (click)="abierto.set(!abierto())" aria-label="Abrir chat">
      {{ abierto() ? '✕' : '💬' }}
    </button>

    @if (abierto()) {
      <section class="chat-panel" aria-label="Asistente virtual">
        <header class="chat-header">Asistente virtual</header>
        <div class="chat-body" #cuerpo>
          @for (m of mensajes(); track $index) {
            <div class="burbuja" [class.usuario]="m.rol === 'usuario'">{{ m.contenido }}</div>
          }
          @if (cargando()) {
            <div class="burbuja escribiendo">Escribiendo…</div>
          }
        </div>
        <form class="chat-form" (ngSubmit)="enviar()">
          <input [(ngModel)]="texto" name="texto" placeholder="Escribe tu pregunta…" maxlength="1000" [disabled]="cargando()" />
          <button type="submit" [disabled]="cargando() || !texto.trim()">Enviar</button>
        </form>
      </section>
    }
  `,
})
export class ChatbotComponent {
  private api = inject(ApiService);
  @ViewChild('cuerpo') cuerpo?: ElementRef<HTMLDivElement>;

  abierto = signal(false);
  cargando = signal(false);
  mensajes = signal<MensajeChat[]>([
    { rol: 'asistente', contenido: '¡Hola! Soy el asistente de la veterinaria. ¿En qué te puedo ayudar?' },
  ]);
  texto = '';
  private sesionId = crypto.randomUUID();

  enviar(): void {
    const mensaje = this.texto.trim();
    if (!mensaje || this.cargando()) return;

    // Historial previo (sin el saludo inicial) para dar contexto al modelo
    const historial = this.mensajes().slice(1);
    this.mensajes.update((l) => [...l, { rol: 'usuario', contenido: mensaje }]);
    this.texto = '';
    this.cargando.set(true);
    this.desplazar();

    this.api.chatbot(mensaje, this.sesionId, historial).subscribe({
      next: (r) => this.responder(r.respuesta),
      error: () => this.responder('No pude conectar con el asistente. Intenta de nuevo en unos minutos.'),
    });
  }

  private responder(texto: string): void {
    this.mensajes.update((l) => [...l, { rol: 'asistente', contenido: texto }]);
    this.cargando.set(false);
    this.desplazar();
  }

  private desplazar(): void {
    setTimeout(() => {
      const el = this.cuerpo?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
