import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from './entities/expense.entity';
import { CashService } from '../cash/cash.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateGastoDto } from './dto/update-expense.dto';
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

  cajaId = this.configService.get<string>('CAJA_ID');

  async create(createGastoDto: CreateExpenseDto) {
    const caja = await this.cashService.findOneById(this.cajaId);
    if (!caja) throw new NotFoundException();

    caja.principal = parseFloat((Number(caja.principal) - createGastoDto.amount).toFixed(2))

    if (
      new Date(createGastoDto.date).toDateString() ===
      new Date().toDateString()
    ) {
      caja.salidas = parseFloat((Number(caja.salidas) + createGastoDto.amount).toFixed(2))
    }

    await this.cashService.update(this.cajaId, caja);

    const gasto = await this.expenseRepository.create({
      ...createGastoDto,
    });

    // gasto.usuario = await this.usuarioService.findOneById(
    //   createGastoDto.idUsuario,
    // );
    gasto.supplier = await this.supplierService.findOneById(
      createGastoDto.supplierId,
    );
    //gasto.caja = caja;

    return await this.expenseRepository.save(gasto);
  }

  async findAll() {
    return await this.expenseRepository.find({
      relations: { supplier: true },
      select: {
        supplier: { name: true, category: true },
      },
    });
  }

  async findByProveedor(id:string) {
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

  async update(id: string, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.findOneById(id);
    if (!gasto) throw new NotFoundException();
    Object.assign(gasto, updateGastoDto);
    return await this.expenseRepository.save(gasto);
  }

  async remove(id: string) {
    const gasto = await this.findOneById(id);
    if (!gasto) throw new NotFoundException();

    if (new Date(gasto.date).getDay() == new Date().getDay()) {
      return await this.expenseRepository.remove(gasto);
    } else return {};
  }
}
