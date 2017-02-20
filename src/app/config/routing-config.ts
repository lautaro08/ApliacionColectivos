import { ColectivoNuevoComponent } from './../colectivo-nuevo/colectivo-nuevo.component';
import { RecorridosComponent } from './../recorridos/recorridos.component';
import { ColectivoEditorComponent } from './../colectivo-editor/colectivo-editor.component';
import {Route, Routes} from "@angular/router";
import { AppComponent } from '../app.component';
import { MapComponent } from '../map/map.component';
import { AdminComponent } from '../admin/admin.component';

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
        path: 'home',
        component: MapComponent
    },
    {
        path: 'recorridos',
        component: RecorridosComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'editorColectivo/:id',
        component: ColectivoEditorComponent
    },
    {
        path: 'nuevoColectivo',
        redirectTo: 'editorColectivo/nuevo',
        pathMatch: 'full'
    },
    fallbackRoute,
    indexRoute
];