import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Order } from '../../order/entities/order.entity';
import { Branch } from '../../branch/entities/branch.entity';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  company: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  ruc: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  addres: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Branch, (branch) => branch.clients)
  branch: Branch;

  @OneToMany(() => Order, (orders) => orders.client)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
