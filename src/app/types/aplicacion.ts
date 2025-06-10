export interface Aplicacion {
  id: number;
  name: string;
  description: string;
  url: string;
  icon: string;

  // Atributos adicionales opcionales
  estado?: 'produccion' | 'desarrollo' | 'proximamente';
  etiquetas?: string[];
  fechaActualizacion?: Date;
  version?: string;
  autor?: string;
}
