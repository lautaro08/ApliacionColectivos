import { Ruta } from './../shared/models/ruta';
import { AfService } from './../af.service';
import { Colectivo } from './../shared/models/colectivo';
import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-colectivo-editor',
  templateUrl: './colectivo-editor.component.html',
  styleUrls: ['./colectivo-editor.component.css'],
  providers: [AfService]
})
export class ColectivoEditorComponent implements OnInit {

  //path predeterminado 
  paths : any = [
    {lat:-32.489723535115274,lng:-58.25878143310547},
    {lat:-32.49406725857569,lng:-58.25921058654785},
    {lat:-32.475460168462014,lng:-58.263587951660156},
    {lat:-32.472636188236606,lng:-58.22779655456543}
  ];

  //paradas del Colectivo
  paradasMarkers : google.maps.Marker[] = [];

  //colectivo usado para interactuar con el formulario
  colectivoModel : Colectivo;

  //variable para mantener el color que se va modificando
  colorAuxiliar : string;

  submitted = false;

  //flag que indica si el colectivo es nuevo o se esta editando
  creando : boolean;

  //referencia al poligono de la ruta para extraer los cambios que se hacen a la ruta
  polygon : google.maps.Polygon; 

  constructor(
    //Se injecta el servicio de firebase para poder guardar el nuevo colectivo
    private afService: AfService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    //obtiene el parametro id de la url
    var id = this.route.snapshot.params['id'];
    this.creando = (id === 'nuevo');
    if(this.creando){
      //si se esta creando un colectivo
      this.colectivoModel = new Colectivo('', '', '', '#000000', [], this.paths);
    }else{
      //si se esta editando se obtiene de la bd y se carga en colectivoModel
      this.afService.getColectivo(id)
      .do(console.log)
      .subscribe(snapshot =>{        
        if(snapshot.val() != null){      
          this.colectivoModel = Colectivo.fromJson(snapshot.val());    
          this.colectivoModel.$key = snapshot.key;
          this.colectivoModel.ruta = [];
          this.colectivoModel.paradas = [];
          for( let key in snapshot.val().ruta){
            this.colectivoModel.ruta.push(snapshot.val().ruta[key]);
          }      
          for( let key in snapshot.val().paradas){
            this.colectivoModel.paradas.push(snapshot.val().paradas[key]);
          }  
        }       
        console.log(this.colectivoModel);
      });
    }
  }

  onSubmit(){
    this.submitted = true;
    var colectivo = this.colectivoModel;
    //se limpia la ruta anterior para poder guardar el path modificado
    colectivo.ruta = [];
    colectivo.paradas = [];
    this.polygon.getPath().getArray().forEach(
      function(element, index){      
        colectivo.ruta.push(element.toJSON());
      }
    );   
    this.paradasMarkers.forEach(
      function(element, index){      
        colectivo.paradas.push(element.getPosition().toJSON());
      }
    );   
    colectivo.color = this.colorAuxiliar;
    if(this.creando){
      this.afService.createNewColectivo(this.colectivoModel);
    }else{
      this.afService.updateColectivo(this.colectivoModel);
    }   
    this.router.navigate(['/recorridos']);
  }

  onPolygonInit(poligono){
    //se cguarda la referencia al poligono para poder obtener el path modificado
    console.log('poligono referenciado');
    this.polygon = poligono;
  }

  onMarkerInit(marcador){
    this.paradasMarkers.push(marcador);
  }

  colorChange(newColor){
    //metodo para actualizar los valores ya que el selector de color no soporta NgModel
    console.log('cambio el color: ', newColor);
    this.polygon.setOptions({strokeColor: newColor});
    this.colorAuxiliar = newColor;
  }

  //funcion que agrega los marcadores de las paradas
  mapClicked($event){
    this.colectivoModel.paradas.push($event.latLng);
  }
}
