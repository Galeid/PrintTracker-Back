import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClienteDto: CreateClientDto) {
    const cliente = await this.clientRepository.create({
      ...createClienteDto,
    });
    return await this.clientRepository.save(cliente);
  }

  async findAll() {
    return await this.clientRepository.find({ where: { status: true } });
  }

  async findOneById(id: string) {
    return await this.clientRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateClienteDto: UpdateClientDto) {
    const cliente = await this.findOneById(id);
    if (!cliente) throw new NotFoundException();
    Object.assign(cliente, updateClienteDto);
    return await this.clientRepository.save(cliente);
  }

  async remove(id: string) {
    return await this.update(id, { status: false });
  }
}
