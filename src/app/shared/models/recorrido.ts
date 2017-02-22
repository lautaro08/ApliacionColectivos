export class Recorrido {


    constructor(
        public $key:string,
        public nombre: string,
        public descripcion: string,
        public color: string,
        public ruta: any[]) {

    }

    static fromJsonList(array): Recorrido[] {
        return array.map(Recorrido.fromJson);
    }

    static fromJson({$key, nombre, descripcion, color, ruta}): Recorrido {
        return new Recorrido(
            $key,
            nombre,
            descripcion,
            color,
            ruta
        );
    }


}