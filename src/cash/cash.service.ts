import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cash } from './entities/cash.entity';
import { CreateCashDto } from './dto/create-cash.dto';
import { UpdateCashDto } from './dto/update-cash.dto';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from '../auth/dto/payload.dto';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(Cash)
    private cashRepository: Repository<Cash>,
    private configService: ConfigService,
  ) {}

  cashId = this.configService.get<string>('CAJA_ID');

  async create(createCashDto: CreateCashDto) {
    const cash = await this.cashRepository.create({
      ...createCashDto,
    });
    return await this.cashRepository.save(cash);
  }

  async findAll() {
    return await this.cashRepository.find({ where: { status: true } });
  }

  async findOneById(id: string) {
    return await this.cashRepository.findOne({
      where: { id },
    });
  }

  async findOneByBranch(payload: PayloadDto) {
    return await this.cashRepository.findOne({
      where: {
        branch: {
          id: payload.branch,
        },
      },
      relations: {
        branch: true,
      }
    });
  }

  async update(id: string, updateCashDto: UpdateCashDto) {
    const cash = await this.findOneById(id);
    if (!cash) throw new NotFoundException();
    Object.assign(cash, updateCashDto);
    return await this.cashRepository.save(cash);
  }

  async remove(id: string) {
    return await this.update(id, { status: false });
  }
}
