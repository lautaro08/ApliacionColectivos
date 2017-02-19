import { Ruta } from './../shared/models/ruta';
import { AfService } from './../af.service';
import { Colectivo } from './../shared/models/colectivo';
import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import {Observable} from "rxjs/Rx";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-colectivo-editor',
  templateUrl: './colectivo-editor.component.html',
  styleUrls: ['./colectivo-editor.component.css'],
  providers: [AfService]
})
export class ColectivoEditorComponent implements OnInit {

  colectivoInput : any;
  //el objeto poligono que tiene la ruta del colectivo
  ruta : any[] = [];

  polygono : any;

  id: any;

  paths : any = [
    {lat:-32.489723535115274,lng:-58.25878143310547},
    {lat:-32.49406725857569,lng:-58.25921058654785},
    {lat:-32.475460168462014,lng:-58.263587951660156},
    {lat:-32.472636188236606,lng:-58.22779655456543}
  ];

  submitted = false;

  constructor(
    public afService: AfService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    if(this.id == 'nuevo'){
       this.colectivoInput = new Colectivo('','', '', '#0000e6', this.paths);
       this.ruta = this.paths;
       console.log('nuevo colectivo cargado en pantalla');
    }else{
      this.afService.getColectivo(this.id)
      .do(console.log)
      .subscribe(snapshot =>{         
        if(snapshot.val() != null){      
          console.log(snapshot.val());     



          for( let key in snapshot.val().ruta){
            console.log(snapshot.val().ruta[key]);
            this.ruta.push(snapshot.val().ruta[key]);
          }




          this.colectivoInput = snapshot.val();         
        }       
      console.log(this.colectivoInput);
    });
  }}

  onSubmit() { 
    console.log('colectivo guardado');
    this.submitted = true; 
    this.guardarRuta();
    console.log('id', this.id);
    if(this.id === 'nuevo'){
      this.afService.createNewColectivo(this.colectivoInput);
    }else{
      this.afService.updateColectivo(this.colectivoInput);
    }
  }

  onPolyInit(polygon){
    console.log('polygon', polygon);
    this.polygono = polygon;
  }

  guardarRuta(){
    var auxPath = [];
    this.polygono.getPath().getArray().forEach(
      function(element, index){
        auxPath.push(element.toJSON());
      }
    );   
    this.colectivoInput.ruta = auxPath;
    console.log(auxPath);
  }
}

