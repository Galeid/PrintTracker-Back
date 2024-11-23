import { TipoPedido } from "../enums/TipoPedido";

export class CreatePedidoDto {
  descripcion: string;
  monto: number;
  tipo: TipoPedido;
  fecha: Date;
  idCliente: string;
}
