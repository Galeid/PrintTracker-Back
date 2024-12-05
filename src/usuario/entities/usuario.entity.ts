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
import { Pedido } from '../../pedido/entities/pedido.entity';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';

import { UsuarioRol } from '../enums/UsuarioRol';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  usuario: string;

  @Column({ type: 'varchar', length: 100, select: false })
  contrasena: string;

  @Column({ type: 'enum', enum: UsuarioRol, default: UsuarioRol.CONTROLADOR })
  rol: UsuarioRol;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.usuarios)
  sucursal: Sucursal;

  @OneToMany(() => Gasto, (gastos) => gastos.usuario)
  gastos: Gasto[];

  @OneToMany(() => Pedido, (pedidos) => pedidos.usuario)
  pedidos: Pedido[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
