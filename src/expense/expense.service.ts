import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from './entities/expense.entity';
import { CashService } from '../cash/cash.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UserService } from '../user/user.service';
import { SupplierService } from '../supplier/supplier.service';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from '../auth/dto/payload.dto';
import { BranchService } from '../branch/branch.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,

    private readonly userService: UserService,
    private readonly supplierService: SupplierService,
    private readonly cashService: CashService,
    private readonly configService: ConfigService,
    private readonly branchService: BranchService,
  ) {}

  cashId = this.configService.get<string>('CAJA_ID');

  async create(createExpenseDto: CreateExpenseDto, payload: PayloadDto) {
    const cash = await this.cashService.findOneByBranch(payload);
    if (!cash) throw new NotFoundException();

    if (
      new Date(createExpenseDto.date).getTime() <=
      new Date(cash.branch.lockDate).getTime()
    ) throw new NotFoundException('Can not create expenses in locked dates');

    if (!createExpenseDto.secondary) {
      cash.main = parseFloat((Number(cash.main) - Number(createExpenseDto.amount)).toFixed(2))
    } else {
      cash.secondary = parseFloat((Number(cash.secondary) - Number(createExpenseDto.amount)).toFixed(2))
    }

    await this.cashService.update(cash.id, cash);

    const expense = await this.expenseRepository.create({
      ...createExpenseDto,
    });




    expense.user = await this.userService.findOneById(
      payload.sub,
    );
    expense.supplier = await this.supplierService.findOneById(
      createExpenseDto.supplierId,
    );
    expense.branch = await this.branchService.findOneById(
      payload.branch,
    );

    return await this.expenseRepository.save(expense);
  }

  async findAll() {
    return await this.expenseRepository.find({
      relations: { supplier: true },
      select: {
        supplier: { name: true, category: true },
      },
    });
  }

  async findBySupplier(id:string) {
    return await this.expenseRepository.find({
      where: {
        supplier: { id}
      },
      relations: { supplier: true },
      select: {
        supplier: { name: true, category: true },
      },
    });
  }

  async findOneById(id: string) {
    return await this.expenseRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.findOneById(id);
    if (!expense) throw new NotFoundException();
    Object.assign(expense, updateExpenseDto);
    return await this.expenseRepository.save(expense);
  }

  async remove(id: string) {
    const expense = await this.findOneById(id);
    if (!expense) throw new NotFoundException();

    if (new Date(expense.date).getDay() == new Date().getDay()) {
      return await this.expenseRepository.remove(expense);
    } else return {};
  }
}
