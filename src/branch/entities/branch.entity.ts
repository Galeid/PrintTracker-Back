import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Expense } from '../../expense/entities/expense.entity';
import { Order } from '../../order/entities/order.entity';
import { User } from '../../user/entities/user.entity';
import { Client } from '../../client/entities/client.entity';
import { Supplier } from '../../supplier/entities/supplier.entity';

@Entity({ name: 'branches' })
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => User, (users) => users.branch)
  users: User[];

  @OneToMany(() => Client, (clients) => clients.branch)
  clients: Client[];

  @OneToMany(() => Supplier, (suppliers) => suppliers.branch)
  suppliers: Supplier[];

  @OneToMany(() => Expense, (expenses) => expenses.branch)
  expenses: Expense[];

  @OneToMany(() => Order, (orders) => orders.branch)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
