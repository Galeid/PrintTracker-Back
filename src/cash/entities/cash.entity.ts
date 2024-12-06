import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Branch } from '../../branch/entities/branch.entity';

@Entity({ name: 'cashes' })
export class Cash {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', scale: 2, default:0 })
  main: number;

  @Column({ type: 'decimal', scale: 2, default:0 })
  secondary: number;

  @Column({ type: 'decimal', scale: 2 })
  pending: number;

  @Column({ type: 'decimal', scale: 2, default:0 })
  income: number;

  @Column({ type: 'decimal', scale: 2, default:0  })
  outflows: number;

  @Column({ type: 'decimal', scale: 2 })
  todayPendings: number;

  @Column({ type: 'decimal', scale: 2, default:0 })
  pastPaid: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToOne(() => Branch)
  @JoinColumn()
  branch: Branch

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
