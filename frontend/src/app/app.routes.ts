import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { ServiciosComponent } from './pages/servicios/servicios';
import { EspecialidadesComponent } from './pages/especialidades/especialidades';
import { NosotrosComponent } from './pages/nosotros/nosotros';
import { PreciosComponent } from './pages/precios/precios';
import { ContactosComponent } from './pages/contactos/contactos';

export const routes: Routes = [
  { path: '', component: InicioComponent, title: 'Inicio | Patitas Felices' },
  { path: 'servicios', component: ServiciosComponent, title: 'Servicios | Patitas Felices' },
  { path: 'especialidades', component: EspecialidadesComponent, title: 'Especialidades | Patitas Felices' },
  { path: 'nosotros', component: NosotrosComponent, title: 'Nosotros | Patitas Felices' },
  { path: 'precios', component: PreciosComponent, title: 'Precios | Patitas Felices' },
  { path: 'contactos', component: ContactosComponent, title: 'Contactos | Patitas Felices' },
  { path: '**', redirectTo: '' },
];
