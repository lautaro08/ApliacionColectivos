import { Colectivo } from './../shared/models/colectivo';
import { AfService } from './../af.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recorridos',
  templateUrl: './recorridos.component.html',
  styleUrls: ['./recorridos.component.css'],
  providers: [AfService]
})
export class RecorridosComponent implements OnInit {

  colectivos: Colectivo[];

  poligonos: google.maps.Polygon[] = [];

  constructor(private afService: AfService) { 
    
  }

  ngOnInit() {
    this.afService.findAllColectivos()
      .do(console.log)
      .subscribe(
        colectivos => colectivos = this.colectivos = colectivos
      );
    console.log("listas obtenidas desde recorridos", this.colectivos);
  }

  onPolygonInit(polygono, colectivo: Colectivo, index: number){
    this.poligonos.push(polygono);
    var path = [];
    for( let key in colectivo.ruta){
      console.log(colectivo.ruta[key]);
      path.push(colectivo.ruta[key]);
    }
    console.log(path);
    polygono.setPaths(path);
  }

  mouseOverPolygon(index: number){
    var res = this.poligonos[index];
    console.log(index, res);
  }

  colectivoSelected(index: number, color: string){
    this.poligonos.forEach((poligono, i) => {
      if(i != index){
        poligono.setOptions({
          strokeColor: '#888888',
          strokeOpacity: 0.3
        });
      }else{
        poligono.setOptions({
          strokeColor: color,
          strokeOpacity: 0.8
        });
      }
    });
  }

  aVerQueHay(){
    console.log("listas obtenidas desde recorridos", this.colectivos);
    console.log("lista de poligonos", this.poligonos);
  }

}
