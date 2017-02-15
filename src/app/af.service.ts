import { Colectivo } from './shared/models/colectivo';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Rx";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';

@Injectable()
export class AfService {

  afDb : any;

  constructor(public af : AngularFire) { 
    this.afDb = af.database;
  }

  findAllColectivos():Observable<Colectivo[]> {

        return this.afDb.list('colectivos')
            .do(console.log)
            .map(Colectivo.fromJsonList);
  }

  createNewColectivo(colectivo:any) {
      var nuevoColectivo = {
        nombre: colectivo.nombre,
        descripcion: colectivo.descripcion,
        ruta: colectivo.ruta
      };
      console.log(nuevoColectivo);
      this.afDb.list('colectivos').push(nuevoColectivo);
  }

  updateColectivo(colectivo: any) {
    var nuevoColectivo = {
        nombre: colectivo.nombre,
        descripcion: colectivo.descripcion,
        ruta: colectivo.ruta
    };
    console.log(nuevoColectivo);
    this.afDb.list('colectivos').update(colectivo.$key, nuevoColectivo);
  }
}

