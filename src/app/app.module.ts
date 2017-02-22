import { GoogleMapNg2 } from './config/google-maps-config';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AdminComponent } from './admin/admin.component';

import { AgmCoreModule } from 'angular2-google-maps/core';

import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { routeConfig } from './config/routing-config';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './config/firebase-config';
import { RecorridoFormComponent } from './recorrido-form/recorrido-form.component';
import { RecorridosComponent } from './recorridos/recorridos.component';
import { ColectivoFormComponent } from './colectivo-form/colectivo-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AdminComponent,
    RecorridoFormComponent,
    RecorridosComponent,
    ColectivoFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routeConfig),
    MaterialModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    GoogleMapNg2
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
