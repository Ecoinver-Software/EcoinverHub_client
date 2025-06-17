export interface Usuario {
    id:number;
    userName:string;
    email:string;
    roles:string;
    name:string;
    lastname:string;
    empresa:string;
    equipoId:number | null;
}

export interface UsuarioPost{
    
    userName:string;
    password:string;
    email:string;
    roleId:number;
    name:string;
    lastname:string;
    empresa:string;
}
