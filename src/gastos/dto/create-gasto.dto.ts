export enum TipoPago {
  EFECTIVO = 'efectivo',
  YAPE = 'yape',
  TRANSFERENCIA = 'transferencia',
}

export class CreateGastoDto {
  descripcion: string;
  monto: number;
  nroFactura?: string;
  pago: TipoPago;
  fecha: Date;
}
