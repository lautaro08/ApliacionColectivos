import { Router } from '@angular/router';
import { Colectivo } from './../shared/models/colectivo';
import { AfService } from './../af.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colectivo-nuevo',
  templateUrl: './colectivo-nuevo.component.html',
  styleUrls: ['./colectivo-nuevo.component.css'],
  providers: [AfService]
})
export class ColectivoNuevoComponent implements OnInit {

  //path predeterminado 
  paths : any = [
    {lat:-32.489723535115274,lng:-58.25878143310547},
    {lat:-32.49406725857569,lng:-58.25921058654785},
    {lat:-32.475460168462014,lng:-58.263587951660156},
    {lat:-32.472636188236606,lng:-58.22779655456543}
  ];

  colectivoNuevo : Colectivo = new Colectivo('', '', '', '#000000', this.paths);

  submitted = false;

  //referencia al poligono de la ruta para extraer los cambios que se hacen a la ruta
  polygon : google.maps.Polygon; 

  constructor(
    //Se injecta el servicio de firebase para poder guardar el nuevo colectivo
    private afService: AfService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  onSubmit(){
    this.submitted = true;
    var colectivo = this.colectivoNuevo;
    this.polygon.getPath().getArray().forEach(
      function(element, index){
        colectivo.ruta.push(element.toJSON());
      }
    );   
    this.afService.createNewColectivo(this.colectivoNuevo);
    this.router.navigate(['/recorridos']);
  }

  onPolygonInit(poligono){
    console.log('poligono referenciado');
    this.polygon = poligono;
  }

  colorChange(newColor){
    //metodo para actualizar los valores ya que el selector de color no soporta NgModel
    this.colectivoNuevo.color = newColor;
  }
}
