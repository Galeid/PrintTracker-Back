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

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,

    private readonly userService: UserService,
    private readonly supplierService: SupplierService,
    private readonly cashService: CashService,
    private readonly configService: ConfigService,
  ) {}

  cashId = this.configService.get<string>('CAJA_ID');

  async create(createExpenseDto: CreateExpenseDto) {
    const cash = await this.cashService.findOneById(this.cashId);
    if (!cash) throw new NotFoundException();

    cash.main = parseFloat((Number(cash.main) - createExpenseDto.amount).toFixed(2))

    if (
      new Date(createExpenseDto.date).toDateString() ===
      new Date().toDateString()
    ) {
      cash.outflows = parseFloat((Number(cash.outflows) + createExpenseDto.amount).toFixed(2))
    }

    await this.cashService.update(this.cashId, cash);

    const expense = await this.expenseRepository.create({
      ...createExpenseDto,
    });

    // gasto.usuario = await this.usuarioService.findOneById(
    //   createGastoDto.idUsuario,
    // );
    expense.supplier = await this.supplierService.findOneById(
      createExpenseDto.supplierId,
    );
    //gasto.caja = caja;

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
        supplier: { id: id}
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
