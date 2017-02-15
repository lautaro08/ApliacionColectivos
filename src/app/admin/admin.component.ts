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

  constructor(private afService: AfService) { 
    
  }

  ngOnInit() {
    this.afService.findAllColectivos()
      .do(console.log)
      .subscribe(
        colectivos => colectivos = this.colectivos = colectivos
      );
    console.log("listas obtenidas desde AdService");
  }

}
