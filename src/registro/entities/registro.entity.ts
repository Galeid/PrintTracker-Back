import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';

@Entity({ name: 'registros' })
export class Registro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  principalInicial: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  principalFinal: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  pendienteInicial: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  pendienteFinal: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  ingresosTotal: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  salidasTotal: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  pendienteHoy: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  pasadosPagados: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  secundario: number;

  @Column({ type: 'int' })
  nroPedidos: number;

  @Column({ type: 'int' })
  nroGastos: number;

  @Column({ type: 'int' })
  nroPedidosPendientes: number;

  @Column({ type: 'int' })
  nroPasadosPagados: number;

  @Column({ type: 'timestamptz' })
  fecha: Date;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.registros)
  sucursal: Sucursal;

  @ManyToOne(() => Usuario, (usuario) => usuario.registros)
  usuario: Usuario;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
