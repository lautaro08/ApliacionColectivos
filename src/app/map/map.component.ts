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

  //opcion 1: selecciona marcador de ubicacion
  //opcion 2: selecciona marcador de destino
  option : number = 1;

  constructor(private ref: ChangeDetectorRef, private afService: AfService) { }

  ngOnInit() {
    this.afService.findAllParadas()
      .do(console.log)
      .subscribe(
        paradas => paradas = this.paradas = paradas
      );
  }

  onMapReady(map){
    this.mapa = map;
    console.log('mapa referenciado: ',this.mapa);
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
    console.log('autocomplete referenciado: ', this.autocomplete);
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

  handleLocationError(browserHasGeolocation, pos) {

  }

}