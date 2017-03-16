import { Recorrido } from './../shared/models/recorrido';
import { AfService } from './../af.service';
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

  //puede ser CREAR NUEVO o EDITAR dependiendo
  titulo : string;

  //path predeterminado 
  paths : any = [
    {lat:-32.489723535115274,lng:-58.25878143310547},
    {lat:-32.49406725857569,lng:-58.25921058654785},
    {lat:-32.475460168462014,lng:-58.263587951660156},
    {lat:-32.472636188236606,lng:-58.22779655456543}
  ];

  //recorrido usado para interactuar con el formulario
  recorridoModel : Recorrido;

  //variable para mantener el color que se va modificando
  colorAuxiliar : string = '#000000';

  submitted = false;

  //flag que indica si el recorrido es nuevo o se esta editando
  creando : boolean;

  //referencia al poligono de la ruta para extraer los cambios que se hacen a la ruta
  polyline : google.maps.Polyline; 

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
      this.recorridoModel = new Recorrido('', '', '', '#000000', this.paths);
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

  goBack(): void {
    this.location.back();
  }
}
