import { Recorrido } from './../shared/models/recorrido';
import { AfService } from './../af.service';
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Ng2MapComponent } from 'ng2-map';

Ng2MapComponent['apiUrl'] =
  'https://maps.google.com/maps/api/js?key=AIzaSyDZPEwiIvxgr2rmEwuRdtP_k5OyyVYjHIU&libraries=places';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [AfService]
})

export class MapComponent implements OnInit {

  mapa : google.maps.Map;

  autocomplete: google.maps.places.Autocomplete;
  poligono : google.maps.Polygon;
  origen : any;
  destino : any;
  recorridoCercano :any;
  paradas : any[] = [];

  recorridos : any[] = [];

  constructor(private ref: ChangeDetectorRef, private afService: AfService) { }

  ngOnInit() {
    this.afService.findAllParadas()
      //.do()
      .subscribe(
        paradas => paradas = this.paradas = paradas
      );
    this.afService.findAllRecorridos()
      .do(console.log)
      .subscribe(
          recorridos => recorridos = this.recorridos = recorridos
        ); 
  }

  onPolygonInit(poligono){
    this.poligono = poligono;
  }

  onMapReady(map){
    this.mapa = map;
    //console.log('mapa referenciado: ',this.mapa);
  }

  markerInitialized(marcador : google.maps.Marker){
    var icon = {
      url: "../assets/images/parada.png", // url
      scaledSize: new google.maps.Size(20, 20), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    marcador.setIcon(icon);
  }

  initialized(autocompleteRef: any) {
    var concepcion = new google.maps.LatLngBounds(
    new google.maps.LatLng(-32.500228, -58.291129),
    new google.maps.LatLng(-32.456604, -58.217851));

    var options = {
      bounds: concepcion,
      types: ['adress'],
      componentRestrictions: {country: 'ar'}
    };

    this.autocomplete = new google.maps.places.Autocomplete(autocompleteRef, options);
   // console.log('autocomplete referenciado: ', this.autocomplete);
  }

  placeChanged(place: google.maps.places.PlaceResult) {
    this.ref.detectChanges();
    var place = this.autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    this.origen = place.geometry.location.toJSON();
  }

  elegirUbicacionDelMapa(esOrigen){
    if(esOrigen){
      this.origen = this.mapa.getCenter();
    }else{
      this.destino = this.mapa.getCenter();
    }
  }

  myLocation(esOrigen){
    //Averiguar porque dentro de nua funcion de callback no se pueden referenciar
    //variables con this.
    var th = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        th.mapa.setCenter(pos);
        if(esOrigen){
          th.origen = pos;
        }else{
          th.destino = pos;
        }

      }, function() {
        this.handleLocationError(true, th.mapa.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, th.mapa.getCenter());
    }
  }

  deg2rad(degrees){
    var radians = degrees * (Math.PI/180);
    return radians;
  }

  Haversine(lat1,lon1,lat2,lon2) {
    var deltaLat = lat2 - lat1 ;
    var deltaLon = lon2 - lon1 ;
    var earthRadius =  6369087 ; // in meters 3959 in miles.
    var alpha = deltaLat/2;
    var beta     = deltaLon/2;
    var a        = Math.sin(this.deg2rad(alpha)) * Math.sin(this.deg2rad(alpha)) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(this.deg2rad(beta)) * Math.sin(this.deg2rad(beta)) ;
    var c        = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance =  earthRadius * c;
    return distance.toFixed(2);
  }

  paradasMasCercanas(){
    var distMinOrigen  = [];
    var distMinDestino = [];
    var paradaMinOrigen  = [];
    var paradaMinDestino = [];
    var sumatoriaDistancias : any[] = [];

    for(var rec of this.recorridos){
      distMinOrigen[rec.$key] = Number.MAX_SAFE_INTEGER;
      distMinDestino[rec.$key] = Number.MAX_SAFE_INTEGER;
      paradaMinOrigen[rec.$key] = null;
      paradaMinDestino[rec.$key] = null;
      sumatoriaDistancias[rec.$key] = 0;
    }

    for(var parada of this.paradas){
      var distanciaorigen = parseInt(this.Haversine(parada.pos.lat,
                              parada.pos.lng,
                              this.origen.lat(),
                              this.origen.lng()).valueOf()); 
      var distanciaDestino = parseInt(this.Haversine(parada.pos.lat,
                              parada.pos.lng,
                              this.destino.lat(),
                              this.destino.lng()).valueOf()); 
      console.log("distancia a la origen: ", distanciaorigen);
      console.log("distancia al destino: ", distanciaDestino);

      console.log("recorridos de la parada: ", parada.recorridos);
      for(var rec of this.recorridos){
        //Si pasa el recorrido REc por la parada
        
        console.log("el colectivo pasa por la parada "+rec.$key+"?", parada.recorridos.includes(rec.$key.toString()));
        if( parada.recorridos.includes(rec.$key.toString())){

          console.log("distancia a la origen ADENTRO: ", distanciaorigen);
          console.log("distancia al destino ADENTRO: ", distanciaDestino);
          if(distanciaorigen <= distMinOrigen[rec.$key]){
            distMinOrigen[rec.$key] = distanciaorigen;
            paradaMinOrigen[rec.$key] = parada;
          }

          if(distanciaDestino <= distMinDestino[rec.$key]){
            distMinDestino[rec.$key] = distanciaDestino;
            paradaMinDestino[rec.$key] = parada;
          }

          console.log("distAlAorigen: ", distMinOrigen);
          console.log("distAlDestino: ", distMinDestino);
        }

        sumatoriaDistancias[rec.$key] = distMinDestino[rec.$key] + distMinOrigen[rec.$key];
      }
    }

    
    console.log("sumatoria keys: ", sumatoriaDistancias);
    var minimo = Number.MAX_SAFE_INTEGER,keyResult;

    for(var recorrido of this.recorridos){
      if(sumatoriaDistancias[recorrido.$key]< minimo){
        minimo = sumatoriaDistancias[recorrido.$key];
        keyResult = recorrido.$key;
      }
    }

    if(this.recorridoCercano != null){
      this.poligono.setPath(this.recorridos.find(rec=>rec.$key == keyResult).ruta);
      this.poligono.setOptions({strokeColor: this.recorridos.find(rec=>rec.$key == keyResult).color});
    }else{
      this.recorridoCercano = this.recorridos.find(rec=>rec.$key == keyResult);
    }
    
    console.log(this.recorridoCercano);
    console.log("minimo: ", minimo);
    console.log("key", keyResult);
  }

  actualizarUbicaciones(ubicacion, esOrigen){
    if(esOrigen){
      this.origen = ubicacion.latLng;
    }else{
      this.destino = ubicacion.latLng;
    }
  }

  handleLocationError(browserHasGeolocation, pos) {
    //sin implementar
  }

}