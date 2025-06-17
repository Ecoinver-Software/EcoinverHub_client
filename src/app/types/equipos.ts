export interface Equipos {
    id:number;
    nombre:string;
    empresa:string;
    nombreJefe:string;
}

export interface EquiposPost{
    nombre:string;
    jefeEquipoId:string;
    empresa:string;
}