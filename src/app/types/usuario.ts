export interface Usuario {
    id:number;
    userName:string;
    email:string;
    roles:string;
}

export interface UsuarioPost{
    
    userName:string;
    password:string;
    email:string;
    roleId:number;
}
