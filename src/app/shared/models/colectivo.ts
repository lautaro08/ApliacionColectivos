export class Colectivo {


    constructor(
        public $key:string,
        public nombre: string,
        public descripcion: string,
        public ruta: string) {

    }

    static fromJsonList(array): Colectivo[] {
        return array.map(Colectivo.fromJson);
    }

    static fromJson({$key, nombre, descripcion, ruta}): Colectivo {
        return new Colectivo(
            $key,
            nombre,
            descripcion,
            ruta
        );
    }


}