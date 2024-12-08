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

  async create(createClientDto: CreateClientDto) {
    const client = await this.clientRepository.create({
      ...createClientDto,
    });
    return await this.clientRepository.save(client);
  }

  async findAll() {
    return await this.clientRepository.find({ where: { status: true } });
  }

  async findOneById(id: string) {
    return await this.clientRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOneById(id);
    if (!client) throw new NotFoundException();
    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async remove(id: string) {
    return await this.update(id, { status: false });
  }
}
