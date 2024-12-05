export class CreateGastoDto {
  descripcion: string;
  monto: number;
  nroFactura?: string;
  fecha: Date;
  idProveedor: string;
}
