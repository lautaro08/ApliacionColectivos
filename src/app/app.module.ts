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
import { ColectivoEditorComponent } from './colectivo-editor/colectivo-editor.component';
import { Ng2MapModule} from 'ng2-map';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AdminComponent,
    ColectivoEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routeConfig),
    MaterialModule.forRoot(),
    Ng2MapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyBaiyUe1Uzh9eLOcKmHbKO-9Bj22k-pzhg'}),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
