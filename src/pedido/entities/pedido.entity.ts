import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';

import { EstadoPago } from '../enums/EstadoPago';
import { Servicio } from '../../servicio/entities/servicio.entity';

@Entity({ name: 'pedidos' })
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250 })
  descripcion: string;

  @Column({ type: 'decimal', scale: 2 })
  monto: number;

  @Column({ type: 'int', unique: true })
  @Generated('increment')
  nroPedido: number;

  @Column({ type: 'timestamptz' })
  fecha: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fechaPago: Date;

  @Column({ type: 'enum', enum: EstadoPago, default: EstadoPago.PENDIENTE })
  estadoPago: EstadoPago;

  @Column({ type: 'boolean', default: false})
  secundario: boolean;

  @ManyToOne(() => Servicio, (servicio) => servicio.pedidos)
  servicio: Servicio;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.pedidos)
  sucursal: Sucursal;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
  usuario: Usuario;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
  cliente: Cliente;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
