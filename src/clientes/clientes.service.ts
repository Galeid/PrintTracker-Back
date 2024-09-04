import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const cliente = await this.clienteRepository.create({
      ...createClienteDto,
      estado: true,
    });

    return await this.clienteRepository.save(cliente);
  }

  async findAll() {
    return await this.clienteRepository.find({ where: { estado: true } });
  }

  async findOne(id: string) {
    return await this.clienteRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    if (!cliente) throw new NotFoundException();

    Object.assign(cliente, updateClienteDto);

    return await this.clienteRepository.save(cliente);
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    if (!cliente) throw new NotFoundException();

    Object.assign(cliente, { estado: false });

    return await this.clienteRepository.save(cliente);
  }
}
