import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { TipoPago } from './entities/pedido.entity';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get('cliente/:id')
  findByCliente(@Param('id') id: string) {
    return this.pedidoService.findByCliente(id);
  }

  @Patch('pagar/:id')
  pay(@Param('id') id: string, @Body() bodyPay: {tipoPago:TipoPago}) {
    return this.pedidoService.pay(id, bodyPay.tipoPago);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(id);
  }
}
