export class Parada {


    constructor(
        public $key:string,
        public pos: any,
        public recorridos: any[]) {

    }

    static fromJsonList(array): Parada[] {
        return array.map(Parada.fromJson);
    }

    static fromJson({$key, pos, recorridos}): Parada {
        return new Parada(
            $key,
            pos,
            recorridos
        );
    }


}