import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Client } from '../../client/entities/client.entity';
import { Branch } from '../../branch/entities/branch.entity';

import { PaymentStatus } from '../enums/PaymentStatus';
import { Service } from '../../service/entities/service.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'decimal', scale: 2 })
  amount: number;

  @Column({ type: 'int', unique: true })
  @Generated('increment')
  noOrder: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  paymentDate: Date;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'boolean', default: false})
  secondary: boolean;

  @ManyToOne(() => Service, (service) => service.orders)
  service: Service;

  @ManyToOne(() => Branch, (branch) => branch.orders)
  branch: Branch;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Client, (client) => client.orders)
  client: Client;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updated_at: Date;
}
