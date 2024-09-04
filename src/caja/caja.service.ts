import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private cajaRepository: Repository<Caja>,
  ) {}

  async create(createCajaDto: CreateCajaDto) {
    const caja = await this.cajaRepository.create({
      ...createCajaDto,
      estado: true,
    });

    return await this.cajaRepository.save(caja);
  }

  async findAll() {
    return await this.cajaRepository.find({ where: { estado: true } });
  }

  async findOne(id: string) {
    return await this.cajaRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateCajaDto: UpdateCajaDto) {
    const caja = await this.findOne(id);
    if (!caja) throw new NotFoundException();

    Object.assign(caja, updateCajaDto);

    return await this.cajaRepository.save(caja);
  }

  async remove(id: string) {
    const caja = await this.findOne(id);
    if (!caja) throw new NotFoundException();

    Object.assign(caja, { estado: false });

    return await this.cajaRepository.save(caja);
  }
}
