import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "../../usuarios/entities/usuario.entity";

export enum TipoPedido {
  TARJETAS = 'tarjetas',
  VOLANTES = 'volantes',
  SERVICIO_OFFSET = 'offset',
  SERVICIO_PLASTICO = 'plastico',
  OTRO = 'otro',
}

export enum TipoPago {
  EFECTIVO = 'efectivo',
  YAPE = 'yape',
  TRANSFERENCIA = 'transferencia',
}

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  PROCESO = 'proceso',
  COMPLETADO = 'completado',
  ANULADO = 'anulado',
}

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
}

@Entity({ name: 'pedidos' })
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250 })
  descripcion: string;

  @Column({ type: 'decimal', scale: 2 })
  monto: number;

  @Column({ type: 'varchar', length: 15, unique: true })
  nroPedido: string;

  @Column({ type: 'enum', enum: TipoPedido, default: TipoPedido.OTRO })
  tipo: TipoPedido;

  @Column({ type: 'enum', enum: TipoPago, default: TipoPago.EFECTIVO })
  tipoPago: TipoPago;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'date', nullable: true })
  fechaPago: Date;

  @Column({ type: 'enum', enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estado: EstadoPedido;

  @Column({ type: 'enum', enum: EstadoPago, default: EstadoPago.PENDIENTE })
  estadoPago: EstadoPago;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
  usuario: Usuario
}
