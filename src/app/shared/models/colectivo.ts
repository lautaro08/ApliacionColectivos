export class Colectivo {


    constructor(
        public $key:string,
        patente : string,
        marca : string,
        modelo : string,
        activo : boolean,
        ubicacion : string,
        recorridos : any[]) {

    }

    static fromJsonList(array): Colectivo[] {
        return array.map(Colectivo.fromJson);
    }

    static fromJson({$key, patente, marca, modelo, activo, ubicacion, recorridos}): Colectivo {
        return new Colectivo(
            $key,
            patente,
            marca,
            modelo,
            activo,
            ubicacion,
            recorridos
        );
    }


}