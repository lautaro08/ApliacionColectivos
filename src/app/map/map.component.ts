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

  ubicacion : any;
  destino : any;

  paradas : any[] = [];

  recorridos : any[] = [];

  distancia : any = "distancia desconocidaaaaaaaa";

  //opcion 1: selecciona marcador de ubicacion
  //opcion 2: selecciona marcador de destino
  option : number = 1;

  constructor(private ref: ChangeDetectorRef, private afService: AfService) { }

  ngOnInit() {
    this.afService.findAllParadas()
      //.do()
      .subscribe(
        paradas => paradas = this.paradas = paradas
      );
    this.afService.findAllRecorridos()
      //.do(console.log)
      .subscribe(
          recorridos => recorridos = this.recorridos = recorridos
        ); 
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
    this.ubicacion = place.geometry.location.toJSON();
  }

  optionChange(op: number){
    this.option = op;
    console.log("opcion " + this.option + "seleccionada");
    switch(this.option){
      case 1: 
        this.ubicacion = this.mapa.getCenter();
        break;
      case 2:
        this.destino = this.mapa.getCenter();
        break;
    }
  }

  myLocation(option){
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
        switch(option){
          case 1: 
            th.ubicacion = pos;
            break;
          case 2:
            th.destino = pos;
            break;
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

  calcularDistancia(){
    this.fuerzaBruta(this.paradas, this.ubicacion);
  }

  fuerzaBruta(paradas, ubicacion):any{
    var masCercana: any[] = [null, parseInt(this.Haversine(paradas[0].pos.lat,
                              paradas[0].pos.lng,
                              ubicacion.lat(),
                              ubicacion.lng()).valueOf())];
      console.log(masCercana);
    this.paradas.forEach(parada =>{
      var distancia = parseInt(this.Haversine(parada.pos.lat,
                              parada.pos.lng,
                              ubicacion.lat(),
                              ubicacion.lng()).valueOf());  
      if(distancia <= masCercana[1]){
        masCercana[0] = parada;
        masCercana[1] = distancia; 
      }
    });
    return  masCercana[0].pos;
  }

  actualizarUbicaciones(ubicacion, esLlegada){
    if(esLlegada){
      this.destino = this.fuerzaBruta(this.paradas,ubicacion.latLng);
    }else{
      this.ubicacion = this.fuerzaBruta(this.paradas,ubicacion.latLng);
    }
  }
  handleLocationError(browserHasGeolocation, pos) {

  }

}