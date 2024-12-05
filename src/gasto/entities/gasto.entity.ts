import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';

@Entity({ name: 'gastos' })
export class Gasto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250 })
  descripcion: string;

  @Column({ type: 'decimal', scale: 2 })
  monto: number;

  @Column({ type: 'varchar', length: 15, nullable: true })
  nroFactura: string;

  @Column({ type: 'timestamptz' })
  fecha: Date;

  @Column({ type: 'boolean', default: false})
  secundario: boolean;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.gastos)
  sucursal: Sucursal;

  @ManyToOne(() => Usuario, (usuario) => usuario.gastos)
  usuario: Usuario;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.gastos)
  proveedor: Proveedor;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
