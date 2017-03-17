import { DialogsService } from './../../shared/services/dialogs.service';
import { Recorrido } from './../../shared/models/recorrido';
import { Colectivo } from './../../shared/models/colectivo';
import { AfService } from './../../shared/services/af.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core'
import {Observable} from "rxjs/Rx";
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css'],
  providers: [AfService]
})
export class AdminComponent implements OnInit {

  colectivos: Colectivo[];
  recorridos: Recorrido[];

  constructor(
    private afService: AfService,
    private dialogsService: DialogsService, 
    private viewContainerRef: ViewContainerRef
    ) { 
    
  }

  ngOnInit() {
    this.afService.findAllColectivos()
      .do(console.log)
      .subscribe(
        colectivos => colectivos = this.colectivos = colectivos
      );
    this.afService.findAllRecorridos()
      .do(console.log)
      .subscribe(
        recorridos => recorridos = this.recorridos = recorridos
      );
    console.log("listas obtenidas desde AdService");
  }

  removeColectivo(id: string){
    let db = this.afService;
    this.dialogsService
      .confirm('Eliminar colectivo', '¿esta seguro de eliminar este colectivo?', this.viewContainerRef)
      .subscribe(function onNext(res){
        console.log(res);
        if(res){
          db.removeColectivo(id);
        } 
      }); 
  }

  removeRecorrido(id: string){
    let db = this.afService;
    this.dialogsService
      .confirm('Eliminar recorrido', '¿esta seguro de eliminar este recorrido?', this.viewContainerRef)
      .subscribe(function onNext(res){
        console.log(res);
        db.removeRecorrido(id);
      });
  }

}
