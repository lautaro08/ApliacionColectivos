import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  ubicacion : any;
  destino : any;

  //opcion 1: selecciona marcador de ubicacion
  //opcion 2: selecciona marcador de destino
  option : number = 1;

  constructor() { }

  ngOnInit() {
  }

  optionChange(op: number){
    this.option = op;
    console.log("opcion " + this.option + "seleccionada");
  }

  mapClicked($event:any){
    console.log('Map Clicked ');
    switch(this.option){
      case 1: 
        this.ubicacion = $event.latLng;
        break;
      case 2:
        this.destino = $event.latLng;
        break;
    }
  }

}