import { Ruta } from './../shared/models/ruta';
import { AfService } from './../af.service';
import { Colectivo } from './../shared/models/colectivo';
import { Component, OnInit} from '@angular/core';
import { SebmGoogleMap, SebmGoogleMapPolygon, LatLngLiteral } from 'angular2-google-maps/core';

@Component({
  selector: 'app-colectivo-editor',
  templateUrl: './colectivo-editor.component.html',
  styleUrls: ['./colectivo-editor.component.css'],
  providers: [AfService]
})
export class ColectivoEditorComponent implements OnInit {

  //el objeto poligono que tiene la ruta del colectivo
  ruta :any;

  paths : any = [
    {lat:-32.489723535115274,lng:-58.25878143310547},
    {lat:-32.49406725857569,lng:-58.25921058654785},
    {lat:-32.475460168462014,lng:-58.263587951660156},
    {lat:-32.472636188236606,lng:-58.22779655456543}
  ];

  //esto despues va a tener que ser un input para permitir editar colectivos ya creados
  model = new Colectivo('', 'nuevo colectivo', 'descripcion', null);
  nuevaRuta = new Ruta('', '', []);
  submitted = false;

  constructor(public afService: AfService){}

  ngOnInit() {
  }

  onSubmit() { 
    console.log('colectivo guardado');
    this.submitted = true; 
    this.afService.createNewColectivo(this.model);
  }

  onPolyInit(polygon){
    console.log('polygon', polygon);
    this.ruta = polygon;
  }

  guardarRuta(){
    var auxPath = [];
    this.ruta.getPath().getArray().forEach(
      function(element, index){
        auxPath.push(element.toJSON());
      }
    );   
    this.model.ruta = auxPath.toString();
    console.log(auxPath);
  }
}

