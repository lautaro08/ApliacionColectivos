import { DialogsService } from './../shared/services/dialogs.service';
import { Recorrido } from './../shared/models/recorrido';
import { Colectivo } from './../shared/models/colectivo';
import { AfService } from './../af.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core'
import {Observable} from "rxjs/Rx";
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
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
    var confirm = this.openDialog('Eliminar colectivo', '¿esta seguro de eliminar este colectivo?');
    console.log('dialog result ', confirm)
    if(confirm){
      this.afService.removeColectivo(id);
    }  
  }

  removeRecorrido(id: string){
    if(this.openDialog('Eliminar recorrido', '¿esta seguro de eliminar este recorrido?')){
      this.afService.removeRecorrido(id);
    }  
  }

  openDialog(titulo, mensaje): boolean {
    var result;
    this.dialogsService
      .confirm(titulo, mensaje, this.viewContainerRef)
      .subscribe(function onNext(res){
        result = res;
        console.log(res);
      });
    return result;
  }

}
