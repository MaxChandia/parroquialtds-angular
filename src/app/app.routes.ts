import { Routes } from '@angular/router';
import { NoticiasComponent } from './features/noticias/noticias.component';
import { MaterialesComponent } from './features/materiales/materiales.component';
import { HomeComponent } from './features/home/home.component';
import { AportesComponent } from './features/aportes/aportes.component';
import { ContactoComponent } from './features/contacto/contacto.component';

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
];
