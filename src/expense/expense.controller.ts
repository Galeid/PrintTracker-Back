import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PayloadDto } from '../auth/dto/payload.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() request) {
    return this.expenseService.create(createExpenseDto, request.payload as PayloadDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.expenseService.findAll();
  }

  @Get('supplier/:id')
  findBySupplier(@Param('id') id: string) {
    return this.expenseService.findBySupplier(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}
