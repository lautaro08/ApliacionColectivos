export class Colectivo {


    constructor(
        public $key:string,
        public id: string,
        public patente : string,
        public marca : string,
        public modelo : string,
        public activo : string,
        public ubicacion : string,
        public recorridos : any[]) {

    }

    static fromJsonList(array): Colectivo[] {
        return array.map(Colectivo.fromJson);
    }

    static fromJson({$key, id, patente, marca, modelo, activo, ubicacion, recorridos}): Colectivo {
        return new Colectivo(
            $key,
            id,
            patente,
            marca,
            modelo,
            activo,
            ubicacion,
            recorridos
        );
    }


}