export class Colectivo {


    constructor(
        public $key:string,
        public nombre: string,
        public descripcion: string,
        public color: string,
        public paradas: any[],
        public ruta: any[]) {

    }

    static fromJsonList(array): Colectivo[] {
        return array.map(Colectivo.fromJson);
    }

    static fromJson({$key, nombre, descripcion, color, paradas, ruta}): Colectivo {
        return new Colectivo(
            $key,
            nombre,
            descripcion,
            color,
            paradas,
            ruta
        );
    }


}