import { Colectivo } from './shared/models/colectivo';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Rx";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

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

  getColectivo(id: string):Observable<Colectivo>{
    return this.af.database.object("/colectivos/"+id,{preserveSnapshot:true});       
    /*
    return this.afDb.list('colectivos')
        .filter(results => results.$key === id)
        .map(results => Colectivo.fromJson(results[0]));*/
  }

  createNewColectivo(colectivo:any) {
      var db = this.afDb;
      var colectivoRef = db.list('/colectivos').push();
      var nuevoColectivo = {
        nombre: colectivo.nombre,
        descripcion: colectivo.descripcion,
        color: colectivo.color
      };
      colectivoRef.set(nuevoColectivo)
        .then(_ => console.log('exito al crear el nuevo colectivo'))
        .catch(err => console.log(err, 'Error al guardar colectivo en firebase'));
      colectivo.ruta.forEach(
        function(element, index){
          db.list('colectivos/'+colectivoRef.key+'/ruta').push(element);
        }
      );
      colectivo.paradas.forEach(
        function(element, index){
          db.list('colectivos/'+colectivoRef.key+'/paradas').push(element);
        }
      );
      
  }

  updateColectivo(colectivo: any) {
    this.afDb.object('/colectivos/'+colectivo.$key).update({
      nombre: colectivo.nombre,
        descripcion: colectivo.descripcion,
        color: colectivo.color,
        paradas: colectivo.paradas,
        ruta: colectivo.ruta
    })
      .then(_ => console.log('exito al guardar el colectivo'))
      .catch(err => console.log(err, 'tenes un alto error amigo'));
  }
}

