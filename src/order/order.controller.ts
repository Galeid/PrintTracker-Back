import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PayloadDto } from '../auth/dto/payload.dto';
import { PayOrderDto } from './dto/pay-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Request() request) {
    return this.orderService.create(
      createOrderDto,
      request.payload as PayloadDto,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.orderService.findAll();
  }

  @Get('client/:id')
  @UseGuards(AuthGuard)
  findByClient(@Param('id') id: string) {
    return this.orderService.findByClient(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOneById(id);
  }

  @Patch('pay')
  @UseGuards(AuthGuard)
  pay(@Body() payOrderDto: PayOrderDto, @Request() request) {
    return this.orderService.pay(payOrderDto, request.payload as PayloadDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() request) {
    return this.orderService.remove(id, request.payload as PayloadDto);
  }
}
