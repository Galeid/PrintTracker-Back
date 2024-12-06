import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cash } from './entities/cash.entity';
import { CreateCashDto } from './dto/create-cash.dto';
import { UpdateCashDto } from './dto/update-cash.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(Cash)
    private cashRepository: Repository<Cash>,
    private readonly configService: ConfigService,
  ) {}

  cajaId = this.configService.get<string>('CAJA_ID');

  async create(createCajaDto: CreateCashDto) {
    const caja = await this.cashRepository.create({
      ...createCajaDto,
    });
    return await this.cashRepository.save(caja);
  }

  async findAll() {
    return await this.cashRepository.find({ where: { status: true } });
  }

  async findOneById(id: string) {
    return await this.cashRepository.findOne({
      where: { id: this.cajaId },
    });
  }

  async update(id: string, updateCajaDto: UpdateCashDto) {
    const caja = await this.findOneById(id);
    if (!caja) throw new NotFoundException();
    Object.assign(caja, updateCajaDto);
    return await this.cashRepository.save(caja);
  }

  async remove(id: string) {
    return await this.update(id, { status: false });
  }
}
