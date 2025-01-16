import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Expense } from './entities/expense.entity';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { UserModule } from '../user/user.module';
import { SupplierModule } from '../supplier/supplier.module';
import { CashModule } from '../cash/cash.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BranchModule } from '../branch/branch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    UserModule,
    SupplierModule,
    CashModule,
    ConfigModule,
        JwtModule,    BranchModule,

  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
