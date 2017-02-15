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
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'nuevoColectivo',
        component: ColectivoEditorComponent
    },
    fallbackRoute,
    indexRoute
];