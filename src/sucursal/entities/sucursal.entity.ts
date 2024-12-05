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
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';

@Entity({ name: 'sucursales' })
export class Sucursal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @OneToMany(() => Usuario, (usuarios) => usuarios.sucursal)
  usuarios: Usuario[];

  @OneToMany(() => Cliente, (clientes) => clientes.sucursal)
  clientes: Cliente[];

  @OneToMany(() => Proveedor, (proveedores) => proveedores.sucursal)
  proveedores: Proveedor[];

  @OneToMany(() => Gasto, (gastos) => gastos.sucursal)
  gastos: Gasto[];

  @OneToMany(() => Pedido, (pedidos) => pedidos.sucursal)
  pedidos: Pedido[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
