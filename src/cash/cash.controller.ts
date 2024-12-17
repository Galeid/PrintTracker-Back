import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';

import { PayloadDto } from '../auth/dto/payload.dto';
import { CreateCashDto } from './dto/create-cash.dto';
import { UpdateCashDto } from './dto/update-cash.dto';

import { CashService } from './cash.service';
import { Cash } from './entities/cash.entity';

import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('cashes')
export class CashController {
  constructor(private readonly cashService: CashService) {}

  @Post()
  create(@Body() createCashDto: CreateCashDto) {
    return this.cashService.create(createCashDto);
  }

  @Get()
  findAll() {
    return this.cashService.findAll();
  }

  @Get('branch')
  @UseGuards(AuthGuard)
  findByBranch(@Request() request): Promise<Cash> {
    return this.cashService.findOneByBranch(request.payload as PayloadDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashService.findOneById(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCashDto: UpdateCashDto) {
    return this.cashService.update(id, updateCashDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashService.remove(id);
  }
}
