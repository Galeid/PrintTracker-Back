import { Injectable } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SucursalService {
  constructor(
    @InjectRepository(Sucursal)
    private sucursalRepository: Repository<Sucursal>,
  ) {}

  async create(createSucursalDto: CreateSucursalDto) {
    const sucursal = await this.sucursalRepository.create({
      ...createSucursalDto,
    });
    return await this.sucursalRepository.save(sucursal);
  }

  findAll() {
    return `This action returns all sucursal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sucursal`;
  }

  update(id: number, updateSucursalDto: UpdateSucursalDto) {
    return `This action updates a #${id} sucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursal`;
  }
}
