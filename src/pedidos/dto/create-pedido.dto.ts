import { EstadoPago, EstadoPedido, TipoPago, TipoPedido } from "../entities/pedido.entity";

export class CreatePedidoDto {
  descripcion: string;
  monto: number;
  nroPedido: string;
  tipo: TipoPedido;
  tipoPago: TipoPago;
  fecha: Date;
  fechaPago?: Date;
  estado: EstadoPedido;
  estadoPago: EstadoPago;
}
