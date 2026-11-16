import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modelos que devuelve el backend (coinciden con las tablas de MySQL)
export interface InfoClinica {
  nombre: string;
  historia: string;
  mision: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  latitud: number;
  longitud: number;
}
export interface Multimedia { clave: string; tipo: 'video' | 'imagen'; url: string; descripcion: string; fuente: string; }
export interface Servicio { id: number; nombre: string; descripcion: string; icono: string; }
export interface Especialidad { id: number; nombre: string; descripcion: string; imagen_url: string | null; }
export interface Precio { id: number; concepto: string; descripcion: string; monto: number; moneda: string; servicio: string | null; }
export interface Foto { id: number; titulo: string; imagen_url: string; }
export interface ContactoPayload { nombre: string; email: string; telefono?: string; asunto?: string; mensaje: string; }
export interface MensajeChat { rol: 'usuario' | 'asistente'; contenido: string; }

// Todas las llamadas van al backend Node.js. En desarrollo, /api se redirige con proxy.conf.json
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly base = '/api';

  getClinica(): Observable<InfoClinica> { return this.http.get<InfoClinica>(`${this.base}/clinica`); }
  getMultimedia(clave: string): Observable<Multimedia> { return this.http.get<Multimedia>(`${this.base}/multimedia/${clave}`); }
  getGaleria(): Observable<Foto[]> { return this.http.get<Foto[]>(`${this.base}/galeria`); }
  getServicios(): Observable<Servicio[]> { return this.http.get<Servicio[]>(`${this.base}/servicios`); }
  getEspecialidades(): Observable<Especialidad[]> { return this.http.get<Especialidad[]>(`${this.base}/especialidades`); }
  getPrecios(): Observable<Precio[]> { return this.http.get<Precio[]>(`${this.base}/precios`); }
  enviarContacto(datos: ContactoPayload): Observable<{ mensaje: string; id: number }> {
    return this.http.post<{ mensaje: string; id: number }>(`${this.base}/contactos`, datos);
  }
  chatbot(mensaje: string, sesionId: string, historial: MensajeChat[]): Observable<{ respuesta: string }> {
    return this.http.post<{ respuesta: string }>(`${this.base}/chatbot`, { mensaje, sesionId, historial });
  }
}
