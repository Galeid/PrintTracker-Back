import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto) {
    const proveedor = await this.proveedorRepository.create({
      ...createProveedorDto,
    });
    return await this.proveedorRepository.save(proveedor);
  }

  async findAll() {
    return await this.proveedorRepository.find({ where: { estado: true } });
  }

  async findOneById(id: string) {
    return await this.proveedorRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateProveedorDto: UpdateProveedorDto) {
    const proveedor = await this.findOneById(id);
    if (!proveedor) throw new NotFoundException();
    Object.assign(proveedor, updateProveedorDto);
    return await this.proveedorRepository.save(proveedor);
  }

  async remove(id: string) {
    return await this.update(id, { estado: false });
  }
}
