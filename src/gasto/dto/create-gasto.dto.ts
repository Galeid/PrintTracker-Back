import { TipoGasto } from "../enums/TipoGasto";

export class CreateGastoDto {
  descripcion: string;
  monto: number;
  nroFactura?: string;
  fecha: Date;
  tipo: TipoGasto;
  idProveedor: string;
}
