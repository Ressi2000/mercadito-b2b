export interface CarritoItem {
  materialId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Carrito {
  empresaId: number;
  items: CarritoItem[];
  total: number;
}
