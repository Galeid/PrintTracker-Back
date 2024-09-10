import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'caja' })
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
  cuentaTD: number;
  @Column({ type: 'decimal', scale: 2 })
  efectivoTD: number;

  @Column({ type: 'decimal', scale: 2 })
  gastosEfectivoTD: number;

  @Column({ type: 'decimal', scale: 2 })
  gastosCuentaTD: number;

  @Column({ type: 'decimal', scale: 2 })
  pendientesTD: number;

  @Column({ type: 'decimal', scale: 2 })
  pendPagadosTD: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
