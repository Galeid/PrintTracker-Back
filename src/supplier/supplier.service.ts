import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.supplierRepository.create({
      ...createSupplierDto,
    });
    return await this.supplierRepository.save(supplier);
  }

  async findAll() {
    return await this.supplierRepository.find({ where: { status: true } });
  }

  async findOneById(id: string) {
    return await this.supplierRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.findOneById(id);
    if (!supplier) throw new NotFoundException();
    Object.assign(supplier, updateSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  async remove(id: string) {
    return await this.update(id, { status: false });
  }
}
