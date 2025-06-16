export interface Anuncio {
    id:number;
    creador: string;
    nombre: string;
    estado: string;
    contenido: string;
    createdAt: Date;
}

export interface AnuncioPost {
    creador: string;
    nombre: string;
    estado: string;
    contenido: string;
}

export interface AnuncioPut {
    nombre: string;
    estado: string;
    contenido: string;
}