import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Gasto } from '../../gasto/entities/gasto.entity';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';

@Entity({ name: 'proveedores' })
export class Proveedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  ruc: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  empresa: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rubro: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.proveedores)
  sucursal: Sucursal;

  @OneToMany(() => Gasto, (gastos) => gastos.proveedor)
  gastos: Gasto[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
