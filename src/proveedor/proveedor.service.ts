import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto) {
    const proveedor = await this.proveedorRepository.create({
      ...createProveedorDto,
      estado: true,
    });

    return await this.proveedorRepository.save(proveedor);
  }

  async findAll() {
    return await this.proveedorRepository.find({ where: { estado: true } });
  }

  async findOne(id: string) {
    return await this.proveedorRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateProveedorDto: UpdateProveedorDto) {
    const proveedor = await this.findOne(id);
    if (!proveedor) throw new NotFoundException();

    Object.assign(proveedor, updateProveedorDto);

    return await this.proveedorRepository.save(proveedor);
  }

  async remove(id: string) {
    const proveedor = await this.findOne(id);
    if (!proveedor) throw new NotFoundException();

    Object.assign(proveedor, { estado: false });

    return await this.proveedorRepository.save(proveedor);
  }
}
