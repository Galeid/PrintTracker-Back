import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  create(createServiceDto: CreateServiceDto) {
    return 'This action adds a new servicio';
  }

  findAll() {
    return `This action returns all servicio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicio`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} servicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicio`;
  }
}
