export interface Anuncio {
    id:number;
    nombre: string;
    estado: string;
    contenido: string;
    createdAt: Date;
}

export interface AnuncioPost {
    nombre: string;
    estado: string;
    contenido: string;
}

export interface AnuncioPut {
    nombre: string;
    estado: string;
    contenido: string;
}