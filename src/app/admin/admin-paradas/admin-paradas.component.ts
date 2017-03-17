import { Ng2MapComponent } from 'ng2-map';
import { Parada } from './../../shared/models/parada';
import { AfService } from './../../shared/services/af.service';
import { Recorrido } from './../../shared/models/recorrido';
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
      console.log('posicion parada inicial: ', $event.latLng.toJSON());
      var parada = new Parada('', $event.latLng.toJSON(), []);
      console.log('recorridos a ver que tienen: ', this.recorridos);
      this.recorridos.forEach((rec, index) =>{
        if(google.maps.geometry.poly.isLocationOnEdge($event.latLng, this.poligonos[index],0.00012)){
          console.log('esta en la ruta del ',rec.nombre);
          parada.recorridos.push(rec.$key);
        }
      });  
      this.paradas.push(parada);
    }
  }

  markerDragged($event, parada : Parada) {
    if($event.latLng != null){
      
      var marcador : google.maps.Marker = $event.target;
      parada.pos = marcador.getPosition().toJSON();
      console.log('nueva ubicacion: ', parada.pos);
      this.recorridos.forEach((rec, index) =>{
        if(google.maps.geometry.poly.isLocationOnEdge($event.latLng, this.poligonos[index],0.00015)){
          console.log('esta en la ruta del ',rec.nombre);
          parada.recorridos.push(rec.$key);
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
    this.afService.saveParadas(this.paradas);
  }

  //Esto se podria cambiar mapiando los recorridos desde firebase
  //a algo asi como una hashtable -> digo yo, anda a saber
  getNameByKey(key) : string {
    var busqueda =this.recorridos.find(rec => rec.$key === key);
    if(busqueda != undefined){
      return busqueda.nombre; 
    }
    return "No pasa ningun recorrido por esta parada";
  }

}
