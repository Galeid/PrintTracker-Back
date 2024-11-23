import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Pedido } from '../../pedido/entities/pedido.entity';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';

@Entity({ name: 'clientes' })
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  ruc: string;

  @Column({ type: 'varchar', length: 100 })
  empresa: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  direccion: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.clientes)
  sucursal: Sucursal;

  @OneToMany(() => Pedido, (pedidos) => pedidos.cliente)
  pedidos: Pedido[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
