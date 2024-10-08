export enum TipoPago {
  EFECTIVO = 'efectivo',
  YAPE = 'yape',
  TRANSFERENCIA = 'transferencia',
}

export class CreateGastoDto {
  descripcion: string;
  monto: number;
  nroFactura?: string;
  tipoPago: TipoPago;
  fecha: Date;
  idUsuario: string;
  idProveedor: string;
  idCaja: string;
}
