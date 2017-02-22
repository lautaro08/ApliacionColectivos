import { Router, ActivatedRoute } from '@angular/router';
import { AfService } from './../af.service';
import { Colectivo } from './../shared/models/colectivo';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colectivo-form',
  templateUrl: './colectivo-form.component.html',
  styleUrls: ['./colectivo-form.component.css']
})
export class ColectivoFormComponent implements OnInit {

  //colectivo usado para interactuar con el formulario
  colectivoModel : Colectivo;

  submitted = false;

  //flag que indica si el colectivo es nuevo o se esta editando
  creando : boolean;

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
      this.colectivoModel = new Colectivo('', '', '', '', false, '', []);
    }else{
      //si se esta editando se obtiene de la bd y se carga en colectivoModel
      this.afService.getColectivo(id)
      .do(console.log)
      .subscribe(snapshot =>{        
        if(snapshot.val() != null){      
          this.colectivoModel = Colectivo.fromJson(snapshot.val());    
          this.colectivoModel.$key = snapshot.key; 
        }       
        console.log(this.colectivoModel);
      });
    }
  }

  onSubmit(){
    this.submitted = true;
    var recorrido = this.colectivoModel;
    if(this.creando){
      this.afService.createNewColectivo(this.colectivoModel);
    }else{
      this.afService.updateColectivo(this.colectivoModel);
    }   
    this.router.navigate(['/recorridos']);
  }

}
