import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { GastoService } from './gasto.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';

@Controller('gastos')
export class GastoController {
  constructor(private readonly gastoService: GastoService) {}

  @Post()
  create(@Body() createGastoDto: CreateGastoDto) {
    return this.gastoService.create(createGastoDto);
  }

  @Get()
  findAll() {
    return this.gastoService.findAll();
  }

  @Get('proveedor/:id')
  findByProveedor(@Param('id') id: string) {
    return this.gastoService.findByProveedor(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gastoService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGastoDto: UpdateGastoDto) {
    return this.gastoService.update(id, updateGastoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gastoService.remove(id);
  }
}
