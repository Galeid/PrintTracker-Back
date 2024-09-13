import { TipoPago, TipoPedido } from "../entities/pedido.entity";

export class CreatePedidoDto {
  descripcion: string;
  monto: number;
  tipo: TipoPedido;
  tipoPago: TipoPago;
  fecha: Date;
  idUsuario: string;
  idCliente: string;
  idCaja: string;
}
