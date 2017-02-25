import { Ng2MapComponent } from 'ng2-map';
import { Parada } from './../shared/models/parada';
import { AfService } from './../af.service';
import { Recorrido } from './../shared/models/recorrido';
import { Component, OnInit } from '@angular/core';

Ng2MapComponent['apiUrl'] =
  'https://maps.google.com/maps/api/js?key=AIzaSyDZPEwiIvxgr2rmEwuRdtP_k5OyyVYjHIU&libraries=geometry';

@Component({
  selector: 'admin-paradas',
  templateUrl: './admin-paradas.component.html',
  styleUrls: ['./admin-paradas.component.css'],
  providers: [AfService]
})
export class AdminParadasComponent implements OnInit {

  paradas : Parada[] = [];

  paradaSeleccionada : Parada;

  marcadorSeleccionado : google.maps.Marker;
  
  recorridos : Recorrido[] = [];

  poligonos: google.maps.Polygon[] = [];

  constructor(private afService: AfService) { }

  ngOnInit() {
    this.afService.findAllRecorridos()
      .do(console.log)
      .subscribe(
        recorridos => recorridos = this.recorridos = recorridos
      );
    this.afService.findAllParadas()
      .do(console.log)
      .subscribe(
        paradas => paradas = this.paradas = paradas
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
    if($event.latLng != null){
      console.log('posicion parada: ', $event.latLng);
      var parada = new Parada('', $event.latLng, []);
      this.recorridos.forEach((rec, index) =>{
        if(google.maps.geometry.poly.isLocationOnEdge($event.latLng, this.poligonos[index],0.00012)){
          console.log('esta en la ruta del ',rec.nombre);
          parada.recorridos.push(rec.nombre);
        }
      });  
      this.paradas.push(parada);
    }
  }

  markerDragged($event, parada : Parada) {
    if($event.latLng != null){
      var marcador : google.maps.Marker = $event.target;
      this.recorridos.forEach((rec, index) =>{
        if(google.maps.geometry.poly.isLocationOnEdge($event.latLng, this.poligonos[index],0.00015)){
          console.log('esta en la ruta del ',rec.nombre);
          parada.recorridos.push(rec.nombre);
        }
      }); 
    }
  }

  markerClicked(event, parada : Parada) {
    var marcador : google.maps.Marker = event.target;
    if(this.paradaSeleccionada === parada){
      this.paradaSeleccionada = null;
      marcador.setAnimation(null);
    }else{
      this.paradaSeleccionada = parada;
      if(this.marcadorSeleccionado != null){
        this.marcadorSeleccionado.setAnimation(null);
      }   
      marcador.setAnimation(google.maps.Animation.BOUNCE);
      this.marcadorSeleccionado = marcador;
    } 
  }

  removeParada(parada){
    console.log('paradas antes de eliminar: ', this.paradas);
    this.paradas = this.paradas.filter(par => par.pos != parada.pos);
    console.log('paaradas despues de eliminar: ', this.paradas);
  }

  guardarParadas(){
    console.log(this.paradas);
    this.paradas.forEach(parada =>{
      if(parada.recorridos === undefined){
        parada.recorridos = [];
      }
      if(parada.pos.constructor === google.maps.LatLng){
        parada.pos = parada.pos.toJSON();
      }
    });
    this.afService.saveParadas(this.paradas);
  }

}
