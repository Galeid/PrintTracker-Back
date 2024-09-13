import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';
import { Caja } from '../../caja/entities/caja.entity';

@Entity({ name: 'registros' })
export class Registro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', scale: 2 })
  cuentaInicial: number;

  @Column({ type: 'decimal', scale: 2 })
  cuentaFinal: number;

  @Column({ type: 'decimal', scale: 2 })
  efectivoInicial: number;

  @Column({ type: 'decimal', scale: 2 })
  efectivoFinal: number;

  @Column({ type: 'decimal', scale: 2 })
  pendienteInicial: number;

  @Column({ type: 'decimal', scale: 2 })
  pendienteFinal: number;

  @Column({ type: 'decimal', scale: 2 })
  ingresosCuentaTotal: number;

  @Column({ type: 'decimal', scale: 2 })
  ingresosEfectivoTotal: number;

  @Column({ type: 'decimal', scale: 2 })
  gastosCuentaTotal: number;

  @Column({ type: 'decimal', scale: 2 })
  gastosEfectivoTotal: number;

  @Column({ type: 'decimal', scale: 2 })
  pendientesHoy: number;

  @Column({ type: 'decimal', scale: 2 })
  pasadosPagados: number;

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

  @ManyToOne(() => Usuario, (usuario) => usuario.registros)
  usuario: Usuario;

  @ManyToOne(() => Caja, (caja) => caja.registros)
  caja: Caja;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
