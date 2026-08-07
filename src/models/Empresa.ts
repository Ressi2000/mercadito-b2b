export interface Empresa {
  id: number;
  nombre_mercancia: string;
  OrgVentaId: string;
  foto?: {
    id: number;
    foto: string;
  } | null;
}