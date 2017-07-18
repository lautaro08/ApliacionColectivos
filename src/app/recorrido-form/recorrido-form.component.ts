import { Recorrido } from './../shared/models/recorrido';
import { AfService } from './../shared/services/af.service';
import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recorrido-form',
  templateUrl: './recorrido-form.component.html',
  styleUrls: ['./recorrido-form.component.css'],
  providers: [AfService]
})
export class RecorridoFormComponent implements OnInit {

  //flag que indica si el recorrido es nuevo o se esta editando
  creando : boolean;

  //puede ser CREAR NUEVO o EDITAR dependiendo
  titulo : string;

  //punto de inicio predeterminado para el recorrido
  puntoInicio : any = [
    {lat:-32.489723535115274,lng:-58.25878143310547},
    {lat:-32.499923535115274,lng:-58.27898143310547}
  ];

  //recorrido usado para interactuar con el formulario
  recorridoModel : Recorrido;

  //variable para mantener el color que se va modificando, negro por defecto
  colorAuxiliar : string = '#000000';

  submitted = false;

  //referencia al poligono de la ruta para extraer los cambios que se hacen a la ruta
  polyline : google.maps.Polyline; 

  begin : google.maps.Marker;
  end : google.maps.Marker;

  constructor(
    //Se injecta el servicio de firebase para poder guardar el nuevo recorrido
    private afService: AfService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
    ) { }

  ngOnInit() {
    //obtiene el parametro id de la url
    var id = this.route.snapshot.params['id'];
    this.creando = (id === 'nuevo');
    if(this.creando){
      //si se esta creando un recorrido
      this.titulo = 'Crear nuevo';
      this.recorridoModel = new Recorrido('', '', '', '#000000', this.puntoInicio);

    }else{
      //si se esta editando se obtiene de la bd y se carga en recorridoModel
      this.titulo = 'Editar';
      this.afService.getRecorrido(id)
      .do(console.log)
      .subscribe(snapshot =>{        
        if(snapshot.val() != null){      
          this.recorridoModel = Recorrido.fromJson(snapshot.val());    
          this.recorridoModel.$key = snapshot.key;
        }       
        console.log(this.recorridoModel);
      });
    }
  }

  onSubmit(){
    this.submitted = true;
    var recorrido = this.recorridoModel;
    //se limpia la ruta anterior para poder guardar el path modificado
    recorrido.ruta = [];
    this.polyline.getPath().getArray().forEach(
      function(element, index){      
        recorrido.ruta.push(element.toJSON());
      }
    );    
    recorrido.color = this.colorAuxiliar;
    if(this.creando){
      this.afService.createNewRecorrido(this.recorridoModel);
    }else{
      this.afService.updateRecorrido(this.recorridoModel);
    }   
    this.router.navigate(['/recorridos/todos']);
  }

  onPolylineInit(polilinea){
    //se cguarda la referencia al poligono para poder obtener el path modificado
    console.log('polilinea referenciada');
    this.polyline = polilinea;
  }

  colorChange(newColor){
    //metodo para actualizar los valores ya que el selector de color no soporta NgModel
    console.log('cambio el color: ', newColor);
    this.polyline.setOptions({strokeColor: newColor});
    this.colorAuxiliar = newColor;
  }
  
  markerInit(marker, isBegin){
    if(isBegin){
      this.begin = marker;    
      marker.setPosition(this.puntoInicio[0]); 
    }else{
      this.end = marker;
      marker.setPosition(this.puntoInicio[1]);
    }
  }

  polylineDragged(){
    console.log("polyline dragged");
    this.begin.setPosition(this.polyline.getPath().getAt(0));
    this.end.setPosition(this.polyline.getPath().getAt(this.polyline.getPath().getLength()-1));
  }

  mapClicked(event: google.maps.MouseEvent){
    this.polyline.getPath().push(event.latLng);  
  }

  deshacer(){
    this.polyline.getPath().pop();
  }

  goBack(): void {
    this.location.back();
  }
}
