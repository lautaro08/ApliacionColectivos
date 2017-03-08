import { Parada } from './shared/models/parada';
import { Recorrido } from './shared/models/recorrido';
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

  findAllRecorridos():Observable<Recorrido[]> {
      return this.afDb.list('recorridos')
        .do(console.log)
        .map(Recorrido.fromJsonList);
  }

  findAllParadas():Observable<Parada[]> {
      return this.afDb.list('paradas')
        .do(console.log)
        .map(Parada.fromJsonList);
  }

  getColectivo(id: string):Observable<Colectivo>{
    return this.af.database.object("/colectivos/"+id,{preserveSnapshot:true});       
    /*
    return this.afDb.list('colectivos')
        .filter(results => results.$key === id)
        .map(results => Colectivo.fromJson(results[0]));*/
  }

  getRecorrido(id: string):Observable<Recorrido>{
    return this.af.database.object("/recorridos/"+id,{preserveSnapshot:true});       
    /*
    return this.afDb.list('colectivos')
        .filter(results => results.$key === id)
        .map(results => Colectivo.fromJson(results[0]));*/
  }

  removeColectivo(id : string){
    this.af.database.object("/colectivos/"+id).remove()
      .then(_ => console.log('exito al eliminar el colectivo'))
      .catch(err => console.log(err, 'Error al eliminar el colectivo de firebase'));
  }

  removeRecorrido(id : string){
    this.af.database.object("/recorridos/"+id).remove()
      .then(_ => console.log('exito al eliminar el recorrido'))
      .catch(err => console.log(err, 'Error al eliminar el recorrido de firebase'));
  }

  saveParadas(paradas) {
      var dbParadas = this.afDb.list('/paradas');
      dbParadas.remove();
      paradas.forEach((parada : Parada) =>{
          if(parada.recorridos === undefined){parada.recorridos = []}
          delete parada.$key;
          dbParadas.push(parada);
      });
  }

  createNewColectivo(colectivo:any) {
      var db = this.afDb;
      var colectivoRef = db.list('/colectivos').push();
      var nuevoColectivo = {
        id: colectivo.id,
        patente: colectivo.patente,
        marca: colectivo.marca,
        modelo: colectivo.modelo,
        activo: 'false',
        recorridos: []
      };
      colectivoRef.set(nuevoColectivo)
        .then(_ => console.log('exito al crear el nuevo colectivo'))
        .catch(err => console.log(err, 'Error al guardar el colectivo en firebase'));
  }

  updateColectivo(colectivo: any) {
    this.afDb.object('/colectivos/'+colectivo.$key).update({
        id: colectivo.id,
        patente: colectivo.patente,
        marca: colectivo.marca,
        modelo: colectivo.modelo
    })
      .then(_ => console.log('exito al actualizar el colectivo'))
      .catch(err => console.log(err, 'terror al actualizar el colectivo'));
  }

  createNewRecorrido(recorrido:any) {
      var db = this.afDb;
      var recorridoRef = db.list('/recorridos').push();
      var nuevoRecorrido = {
        nombre: recorrido.nombre,
        descripcion: recorrido.descripcion,
        color: recorrido.color
      };
      recorridoRef.set(nuevoRecorrido)
        .then(_ => console.log('exito al crear el nuevo recorrido'))
        .catch(err => console.log(err, 'Error al guardar recorrido en firebase'));
      recorrido.ruta.forEach(
        function(element, index){
          db.list('recorridos/'+recorridoRef.key+'/ruta').push(element);
        }
      );    
  }

  updateRecorrido(recorrido: any) {
    this.afDb.object('/recorridos/'+recorrido.$key).update({
        nombre: recorrido.nombre,
        descripcion: recorrido.descripcion,
        color: recorrido.color,
        ruta: recorrido.ruta
    })
      .then(_ => console.log('exito al actualizar el recorrido'))
      .catch(err => console.log(err, 'error al actualizar recorrido'));
  }
}

