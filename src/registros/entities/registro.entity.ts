import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "../../usuarios/entities/usuario.entity";

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
  ingresosTotal: number;

  @Column({ type: 'decimal', scale: 2 })
  gastosTotal: number;

  @Column({ type: 'decimal', scale: 2 })
  pendientesHoy: number;

  @Column({ type: 'decimal', scale: 2 })
  pendientesPasados: number;

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

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.registros)
  usuario: Usuario

}
