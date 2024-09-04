import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "../../usuarios/entities/usuario.entity";

export enum TipoPago {
  EFECTIVO = 'efectivo',
  YAPE = 'yape',
  TRANSFERENCIA = 'transferencia',
}

@Entity({ name: 'gastos' })
export class Gasto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250 })
  descripcion: string;

  @Column({ type: 'decimal', scale: 2 })
  monto: number;

  @Column({ type: 'varchar', length: 15, nullable:true })
  nroFactura: string;

  @Column({ type: 'enum', enum: TipoPago, default: TipoPago.EFECTIVO })
  tipoPago: TipoPago;

  @Column({ type: 'date' })
  fecha: Date;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.gastos)
  usuario: Usuario
}
