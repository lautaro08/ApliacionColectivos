export class Parada {


    constructor(
        public $key:string,
        public pos: string,
        public recorrido: any[]) {

    }

    static fromJsonList(array): Parada[] {
        return array.map(Parada.fromJson);
    }

    static fromJson({$key, pos, recorrido}): Parada {
        return new Parada(
            $key,
            pos,
            recorrido
        );
    }


}