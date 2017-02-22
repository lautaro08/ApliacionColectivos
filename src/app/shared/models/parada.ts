export class Parada {


    constructor(
        public $key:string,
        ubicacion: string,
        recorrido: any[]) {

    }

    static fromJsonList(array): Parada[] {
        return array.map(Parada.fromJson);
    }

    static fromJson({$key, ubicacion, recorrido}): Parada {
        return new Parada(
            $key,
            ubicacion,
            recorrido
        );
    }


}