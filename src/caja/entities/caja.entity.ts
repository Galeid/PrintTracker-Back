import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Gasto } from '../../gasto/entities/gasto.entity';
import { Pedido } from '../../pedido/entities/pedido.entity';
import { Registro } from '../../registro/entities/registro.entity';

@Entity({ name: 'cajas' })
export class Caja {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', scale: 2 })
  cuenta: number;

  @Column({ type: 'decimal', scale: 2 })
  efectivo: number;

  @Column({ type: 'decimal', scale: 2 })
  pendiente: number;

  @Column({ type: 'decimal', scale: 2 })
  cuentaHoy: number;

  @Column({ type: 'decimal', scale: 2 })
  efectivoHoy: number;

  @Column({ type: 'decimal', scale: 2 })
  gastoCuentaHoy: number;

  @Column({ type: 'decimal', scale: 2 })
  gastoEfectivoHoy: number;

  @Column({ type: 'decimal', scale: 2 })
  pendienteHoy: number;

  @Column({ type: 'decimal', scale: 2 })
  pasadosPagadosHoy: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @OneToMany(() => Gasto, (gastos) => gastos.caja)
  gastos: Gasto[];

  @OneToMany(() => Pedido, (pedidos) => pedidos.caja)
  pedidos: Pedido[];

  @OneToMany(() => Registro, (registros) => registros.caja)
  registros: Registro[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
