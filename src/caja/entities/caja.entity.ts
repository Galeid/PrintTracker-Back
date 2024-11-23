import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Sucursal } from '../../sucursal/entities/sucursal.entity';

@Entity({ name: 'cajas' })
export class Caja {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', scale: 2, default:0 })
  principal: number;

  @Column({ type: 'decimal', scale: 2, default:0 })
  secundaria: number;

  @Column({ type: 'decimal', scale: 2 })
  pendiente: number;

  @Column({ type: 'decimal', scale: 2, default:0 })
  ingresos: number;

  @Column({ type: 'decimal', scale: 2, default:0  })
  salidas: number;

  @Column({ type: 'decimal', scale: 2 })
  pendienteHoy: number;

  @Column({ type: 'decimal', scale: 2, default:0 })
  pasadosPagados: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @OneToOne(() => Sucursal)
  @JoinColumn()
  sucursal: Sucursal

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
