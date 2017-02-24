import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Ng2MapComponent } from 'ng2-map';

Ng2MapComponent['apiUrl'] =
  'https://maps.google.com/maps/api/js?key=AIzaSyDZPEwiIvxgr2rmEwuRdtP_k5OyyVYjHIU&libraries=places';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  evento :string = "nada";

  autocomplete: google.maps.places.Autocomplete;

  ubicacion : any;
  destino : any;

  //opcion 1: selecciona marcador de ubicacion
  //opcion 2: selecciona marcador de destino
  option : number = 1;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  acInitialized(autocompleteRef: any) {
    var concepcion = new google.maps.LatLngBounds(
    new google.maps.LatLng(-32.500228, -58.291129),
    new google.maps.LatLng(-32.456604, -58.217851));

    var options = {
      bounds: concepcion,
      types: ['adress'],
      componentRestrictions: {country: 'ar'}
    };

    this.autocomplete = new google.maps.places.Autocomplete(autocompleteRef, options);
    this.evento = "inicializado";
  }

  placeChanged(place: google.maps.places.PlaceResult) {
    this.ref.detectChanges();
    this.evento = "place changed";
    this.ubicacion = this.autocomplete.getPlace().geometry.location;
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