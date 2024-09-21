import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Caja } from './entities/caja.entity';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private cajaRepository: Repository<Caja>,
    private readonly configService: ConfigService,
  ) {}

  cajaId = this.configService.get<string>('CAJA_ID');

  async create(createCajaDto: CreateCajaDto) {
    const caja = await this.cajaRepository.create({
      ...createCajaDto,
    });
    return await this.cajaRepository.save(caja);
  }

  async findAll() {
    return await this.cajaRepository.find({ where: { estado: true } });
  }

  async findOneById(id: string) {
    return await this.cajaRepository.findOne({
      where: { id: this.cajaId },
    });
  }

  async update(id: string, updateCajaDto: UpdateCajaDto) {
    const caja = await this.findOneById(id);
    if (!caja) throw new NotFoundException();
    Object.assign(caja, updateCajaDto);
    return await this.cajaRepository.save(caja);
  }

  async remove(id: string) {
    return await this.update(id, { estado: false });
  }
}
