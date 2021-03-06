import { InicioComponent } from './../../inicio/inicio.component';
import { ColectivoFormComponent } from './../../colectivo-form/colectivo-form.component';
import { RecorridoFormComponent } from './../../recorrido-form/recorrido-form.component';
import { RecorridosComponent } from './../../recorridos/recorridos.component';
import {Route, Routes} from "@angular/router";
import { AppComponent } from '../../app.component';
import { MapComponent } from '../../map/map.component';
import { AdminComponent } from '../../admin/admin-main/admin-main.component';

const indexRoute : Route = {
    path: '',
    component: MapComponent
};

const fallbackRoute : Route = {
    path: '**',
    component: MapComponent
};

export const routeConfig : Routes = [
    {
        path: 'inicio',
        component: InicioComponent
    },
    {
        path: 'comollegar',
        component: MapComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'recorridos',
        component: RecorridosComponent
    },
    {
        path: 'recorridos/todos',
        redirectTo: 'recorridos',
        pathMatch: 'full'
    },
    {
        path: 'recorridos/:id',
        component: RecorridoFormComponent
    },
    {
        path: 'colectivos/:id',
        component: ColectivoFormComponent
    },
    fallbackRoute,
    indexRoute
];