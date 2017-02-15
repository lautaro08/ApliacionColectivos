export class Ruta {


    constructor(
        public $key:string,
        public colectivo:string,
        public paths: any[]) {

    }

    static fromJsonList(array): Ruta[] {
        return array.map(Ruta.fromJson);
    }

    static fromJson({$key, colectivo, paths}): Ruta {
        return new Ruta(
            $key,
            colectivo,
            paths
        );
    }


}