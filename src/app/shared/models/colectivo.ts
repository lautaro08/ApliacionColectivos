export class Colectivo {


    constructor(
        public $key:string,
        public nombre: string,
        public descripcion: string,
        public color: string,
        public ruta: any[]) {

    }

    obtenerPaths(): any[] {
        var paths;
        for(let punto of this.ruta) {
            console.log('Clase colectivo:', punto);
            paths.push({lat: punto.lat, lng: punto.lng})
        }
        return paths;
    }

    static fromJsonList(array): Colectivo[] {
        return array.map(Colectivo.fromJson);
    }

    static fromJson({$key, nombre, descripcion, color, ruta}): Colectivo {
        return new Colectivo(
            $key,
            nombre,
            descripcion,
            color,
            ruta
        );
    }


}