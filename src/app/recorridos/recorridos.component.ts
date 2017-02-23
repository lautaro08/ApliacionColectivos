import { Colectivo } from './../shared/models/colectivo';
import { Recorrido } from './../shared/models/recorrido';
import { AfService } from './../af.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recorridos',
  templateUrl: './recorridos.component.html',
  styleUrls: ['./recorridos.component.css'],
  providers: [AfService]
})
export class RecorridosComponent  {
  
  ultimoSeleccionado : number = -1;

  recorridos : Recorrido[];

  colectivos : Colectivo[];

  poligonos: google.maps.Polygon[] = [];

  constructor(private afService: AfService) { 
    
  }

  ngOnInit() {
    this.afService.findAllRecorridos()
      .do(console.log)
      .subscribe(
        recorridos => recorridos = this.recorridos = recorridos
      );
    this.afService.findAllColectivos()
      .do(console.log)
      .subscribe(colectivos => {
        colectivos = this.colectivos = colectivos;
      }
      );
    console.log("listas obtenidas desde recorridos", this.recorridos);
  }

  onPolygonInit(polygono, recorrido: Recorrido, index: number){
    this.poligonos.push(polygono);
    var path = [];
    for( let key in recorrido.ruta){
      console.log(recorrido.ruta[key]);
      path.push(recorrido.ruta[key]);
    }
    console.log(path);
    polygono.setPaths(path);
  }

  mouseOverPolygon(index: number){
    var res = this.poligonos[index];
    console.log(index, res);
  }

  recorridoSelected(index: number){
    this.poligonos.forEach((poligono, i) => {
      if(i != index && index != this.ultimoSeleccionado){
        poligono.setOptions({
          strokeColor: '#888888',
          strokeOpacity: 0.3
        });
      }else{
        poligono.setOptions({
          strokeColor: this.recorridos[i].color,
          strokeOpacity: 0.8
        });
      }
    });
    if(index === this.ultimoSeleccionado){
      this.ultimoSeleccionado = -1;
    }else{
      this.ultimoSeleccionado = index;
    }
  }

  aVerQueHay(){
    console.log("listas obtenidas desde recorridos", this.recorridos);
    console.log("lista de poligonos", this.poligonos);
  }

}
