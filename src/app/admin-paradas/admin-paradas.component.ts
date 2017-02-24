import { Parada } from './../shared/models/parada';
import { AfService } from './../af.service';
import { Recorrido } from './../shared/models/recorrido';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-paradas',
  templateUrl: './admin-paradas.component.html',
  styleUrls: ['./admin-paradas.component.css'],
  providers: [AfService]
})
export class AdminParadasComponent implements OnInit {

  paradas : Parada[] = [];
  
  recorridos : Recorrido[] = [];

  poligonos: google.maps.Polygon[] = [];

  constructor(private afService: AfService) { }

  ngOnInit() {
    this.afService.findAllRecorridos()
      .do(console.log)
      .subscribe(
        recorridos => recorridos = this.recorridos = recorridos
      );
  }

  onPolygonInit(polygono, recorrido: Recorrido, index: number){
    this.poligonos.push(polygono);
    var path = [];
    for( let key in recorrido.ruta){
      console.log(recorrido.ruta[key]);
      path.push(recorrido.ruta[key]);
    }
    console.log(path);
    polygono.setPaths(path);
  }

  agregarParada($event){
    console.log('posicion parada: ', $event.latLng);
    this.paradas.push(new Parada('', $event.latLng, []));
  }

  markerClicked(event, parada : Parada) {
    var marcador = event.target;
    marcador.ng2MapComponent.openInfoWindow("iw", marcador, {
        parada: parada
    })
  }

  removeParada(parada){
    var index = this.paradas.indexOf(parada);
    console.log("parada:", parada);
    console.log("index de la parada", index);
    delete this.paradas[index];
  }

}
