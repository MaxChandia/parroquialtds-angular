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
];
