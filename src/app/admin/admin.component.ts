import { Recorrido } from './../shared/models/recorrido';
import { Colectivo } from './../shared/models/colectivo';
import { AfService } from './../af.service';
import { Component, OnInit } from '@angular/core'
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

  constructor(private afService: AfService) { 
    
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
    this.afService.removeColectivo(id);
  }

  removeRecorrido(id: string){
    this.afService.removeRecorrido(id);
  }

}
