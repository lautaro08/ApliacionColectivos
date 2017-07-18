import {Colectivo }from './../shared/models/colectivo'; 
import {Recorrido }from './../shared/models/recorrido'; 
import {AfService }from './../shared/services/af.service'; 
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 

@Component( {
        selector:'app-recorridos', 
        templateUrl:'./recorridos.component.html', 
        styleUrls:['./recorridos.component.css'], 
        providers:[AfService]
})
export class RecorridosComponent {

        ultimoSeleccionado:number = -1; 

        recorridos:Recorrido[]; 

        colectivos:Colectivo[]; 

        paradas:any[];

        polylines:google.maps.Polyline[] = []; 


        constructor(private afService:AfService, private changeDetectorRef: ChangeDetectorRef) {

        }

        ngOnInit() {
                this.afService.findAllRecorridos()
                .do(console.log)
                .subscribe(
                        recorridos => recorridos = this.recorridos = recorridos
                ); 
                this.afService.findAllParadas()
                .do(console.log)
                .subscribe(
                        paradas => paradas = this.paradas = paradas
                ); 
                this.afService.findAllColectivos()
                        .do(console.log)
                        .subscribe(colectivos =>  {
                                colectivos = this.colectivos = colectivos; 
                        }
                        ); 
                console.log("listas obtenidas desde recorridos", this.recorridos); 
        }

        onMapReady(map:google.maps.Map) {

                var mapOptions =  {
                        zoomControl:false, 
                        mapTypeControl:false, 
                        scaleControl:false, 
                        streetViewControl:false, 
                        rotateControl:false
                }
                map.setOptions(mapOptions); 
        }

        markerParadaInitialized(marcador : google.maps.Marker){
        var icon = {
                url: "../assets/images/colectivo.png", // url
                scaledSize: new google.maps.Size(20, 20), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
        };
        marcador.setIcon(icon);
        }

        markerColectivoInitialized(marcador : google.maps.Marker){
        var icon = {
                url: "../assets/images/colectivo.png", // url
                scaledSize: new google.maps.Size(20, 20), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
        };

        marcador.setIcon(icon);
        }

        onPolylineInit(polilinea, recorrido:Recorrido, index:number) {
                this.polylines.push(polilinea); 
                polilinea.setPath(recorrido.ruta); 
        }

        recorridoSelected(index:number) {
                this.polylines.forEach((polilinea, i) =>  {
                        if (i != index && index != this.ultimoSeleccionado) {
                polilinea.setOptions( {
                strokeColor:'#888888', 
                strokeOpacity:0.3
                        }); 
                }else {
                polilinea.setOptions( {
                strokeColor:this.recorridos[i].color, 
                strokeOpacity:0.8
                        }); 
                }
                }); 
                if (index === this.ultimoSeleccionado) {
                this.ultimoSeleccionado = -1; 
                }else {
                this.ultimoSeleccionado = index; 
        }
/*IMPORTANTEEEEEEEEE INVESTIGARRRRRR ESTO*/
                this.changeDetectorRef.detectChanges() 
        }
        
}
