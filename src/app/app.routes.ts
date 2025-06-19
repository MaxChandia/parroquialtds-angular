import { Routes } from '@angular/router';
import { NoticiasComponent } from './features/noticias/noticias.component';
import { MaterialesComponent } from './features/materiales/materiales.component';
import { HomeComponent } from './features/home/home.component';
import { AportesComponent } from './features/aportes/aportes.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { ComunidadComponent } from './features/comunidad/comunidad.component';
import { PastoresComponent } from './features/pastores/pastores.component';
import { LoginpageComponent } from './features/login/loginpage/loginpage.component';
import { CrearnoticiaComponent } from './features/crearnoticia/crearnoticia.component';
import { NoticiaspageComponent } from './features/noticiaspage/noticiaspage.component';
import { NoticiaseditComponent } from './features/noticiasedit/noticiasedit.component';
import { BautizosComponent } from './features/sacramentos/bautizos/bautizos.component';
import { ComunionComponent } from './features/sacramentos/comunion/comunion.component';
import { ConfirmacionComponent } from './features/sacramentos/confirmacion/confirmacion.component';
import { ConfesionesComponent } from './features/sacramentos/confesiones/confesiones.component';
import { MatrimonioComponent } from './features/sacramentos/matrimonio/matrimonio.component';
import { UncionComponent } from './features/sacramentos/uncion/uncion.component';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent
    },
    {
        path: 'noticias',
        component: NoticiasComponent, 
    },
    {
        path: 'materiales',
        component: MaterialesComponent
    },
    {
        path: 'aportes',
        component: AportesComponent
    },
    {
        path: 'contacto',
        component: ContactoComponent
    },
     {
        path: 'comunidad',
        component: ComunidadComponent
    },
     {
        path: 'pastores',
        component: PastoresComponent
    },
    {
        path: 'login',
        component: LoginpageComponent
    },
    {
        path: 'admin',
        component:CrearnoticiaComponent
    },
    {
    path: 'noticias/:slug',
    component: NoticiaspageComponent
  },
  {
    path: 'noticias/edit/:slug',
    component: NoticiaseditComponent
  },
  {
    path: 'sacramentos/bautismo',
    component: BautizosComponent
  },
  {
    path: 'sacramentos/comunion',
    component: ComunionComponent
  },
  {
    path:'sacramentos/confirmacion',
    component: ConfirmacionComponent
  },
  {
    path: 'sacramentos/confesion',
    component: ConfesionesComponent
  },
  {
    path: 'sacramentos/matrimonio',
    component: MatrimonioComponent
  },
  {
    path:'sacramentos/uncion',
    component: UncionComponent
  }
];
