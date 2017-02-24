import { DialogsService } from './shared/services/dialogs.service';
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
import { ConfirmDialog } from './shared/services/confirm-dialog/confirm-dialog.component';
import { AdminParadasComponent } from './admin-paradas/admin-paradas.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AdminComponent,
    RecorridoFormComponent,
    RecorridosComponent,
    ColectivoFormComponent,
    ConfirmDialog,
    AdminParadasComponent
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
  exports: [
        ConfirmDialog,
    ],
  providers: [DialogsService],
  entryComponents: [
        ConfirmDialog,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
