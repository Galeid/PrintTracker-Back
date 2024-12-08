import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Branch } from './branch/entities/branch.entity';
import { Cash } from './cash/entities/cash.entity';
import { Client } from './client/entities/client.entity';
import { Expense } from './expense/entities/expense.entity';
import { Order } from './order/entities/order.entity';
import { Service } from './service/entities/service.entity';
import { Supplier } from './supplier/entities/supplier.entity';
import { User } from './user/entities/user.entity';

import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { CashModule } from './cash/cash.module';
import { ClientModule } from './client/client.module';
import { ExpenseModule } from './expense/expense.module';
import { OrderModule } from './order/order.module';
import { ServiceModule } from './service/service.module';
import { SupplierModule } from './supplier/supplier.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL'),
        entities: [
          Branch,
          Cash,
          Client,
          Expense,
          Order,
          Service,
          Supplier,
          User,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    BranchModule,
    CashModule,
    ClientModule,
    ExpenseModule,
    OrderModule,
    ServiceModule,
    SupplierModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
