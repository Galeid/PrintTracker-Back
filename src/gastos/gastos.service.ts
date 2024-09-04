import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Gasto } from './entities/gasto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,
  ) {}

  async create(createGastoDto: CreateGastoDto) {
    const gasto = await this.gastoRepository.create({
      ...createGastoDto,
    });

    return await this.gastoRepository.save(gasto);
  }

  async findAll() {
    return await this.gastoRepository.find();
  }

  async findOne(id: string) {
    return await this.gastoRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.findOne(id);
    if (!gasto) throw new NotFoundException();

    Object.assign(gasto, updateGastoDto);

    return await this.gastoRepository.save(gasto);
  }

  async remove(id: string) {
    const gasto = await this.findOne(id);
    if (!gasto) throw new NotFoundException();

    if (new Date(gasto.fecha).getDay() == new Date().getDay()) {
      return await this.gastoRepository.remove(gasto);
    } else return {}
  }
}
