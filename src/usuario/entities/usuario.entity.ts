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

export enum UsuarioRol {
  ADMIN = 'admin',
  CONTROLADOR = 'controlador',
  REPORTE = 'reporte',
}

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

  @OneToMany(() => Gasto, (gastos) => gastos.usuario)
  gastos: Gasto[];

  @OneToMany(() => Pedido, (pedidos) => pedidos.usuario)
  pedidos: Pedido[];

  @OneToMany(() => Registro, (registros) => registros.usuario)
  registros: Registro[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
