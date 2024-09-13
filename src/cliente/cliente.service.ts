import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const cliente = await this.clienteRepository.create({
      ...createClienteDto,
    });
    return await this.clienteRepository.save(cliente);
  }

  async findAll() {
    return await this.clienteRepository.find({ where: { estado: true } });
  }

  async findOneById(id: string) {
    return await this.clienteRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOneById(id);
    if (!cliente) throw new NotFoundException();
    Object.assign(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: string) {
    return await this.update(id, { estado: false });
  }
}
