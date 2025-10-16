export interface PeticionCompra {
  id: string
  nombreArticulo: string
  cantidad: string
}

export interface RegistroTrabajo {
  id: string
  fechaTrabajo: string
  lugar: string
  tipoTrabajo: string
}

export interface CompraRealizada {
  id: string
  numeroTicket: string
  fecha: string
  nombreArticulo: string
  cantidad: string
  precioUnidad: string
  total: string
}

export interface ItemInventario {
  id: string
  nombreArticulo: string
  cantidad: string
  prenda: 'nuevo' | 'viejo' | 'usado' | ''
  estado: 'limpio' | 'manchado' | 'roto' | ''
}

export interface FormData {
  peticionesCompra: PeticionCompra[]
  registrosTrabajo: RegistroTrabajo[]
  comprasRealizadas: CompraRealizada[]
  inventario: ItemInventario[]
}
