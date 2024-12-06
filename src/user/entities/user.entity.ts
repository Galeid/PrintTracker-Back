import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Expense } from '../../expense/entities/expense.entity';
import { Order } from '../../order/entities/order.entity';
import { Branch } from '../../branch/entities/branch.entity';

import { UserRole } from '../enums/UserRole';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CONTROLLER })
  role: UserRole;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Branch, (branch) => branch.users)
  branch: Branch;

  @OneToMany(() => Expense, (expenses) => expenses.user)
  expenses: Expense[];

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
