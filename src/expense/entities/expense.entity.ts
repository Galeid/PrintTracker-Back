import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { Branch } from '../../branch/entities/branch.entity';

@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'decimal', scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 15, nullable: true })
  noInvoice: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'boolean', default: false})
  secondary: boolean;

  @ManyToOne(() => Branch, (branch) => branch.expenses)
  branch: Branch;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;

  @ManyToOne(() => Supplier, (supplier) => supplier.expenses)
  supplier: Supplier;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
