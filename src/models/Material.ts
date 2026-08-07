// src/models/Material.ts

export interface MaterialFoto {
  id: number;
  material_id: number;
  foto: string;
}

export interface Material {
  id: number;
  MaterialId: string;       // Código SAP del material
  TextoMaterial: string;    // Nombre del material
  TipoMaterial: string;
  UnidadMb: string;         // Unidad de medida base
  PorcImpuesto?: number;
  foto?: MaterialFoto;

  // Precio desde precio_materiales_b3 (viene enriquecido desde backend)
  PrecioNeto?: number;
  MonedaId?: string;
  UnidadMed?: string;
  ListaPrecio?: string;
}