import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { EstadoPedido, Pedido } from './entities/pedido.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const pedido = await this.pedidoRepository.create({
      ...createPedidoDto,
    });

    return await this.pedidoRepository.save(pedido);
  }

  async findAll() {
    return await this.pedidoRepository.find();
  }

  async findOne(id: string) {
    return await this.pedidoRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.findOne(id);
    if (!pedido) throw new NotFoundException();

    Object.assign(pedido, updatePedidoDto);

    return await this.pedidoRepository.save(pedido);
  }

  async remove(id: string) {
    const pedido = await this.findOne(id);
    if (!pedido) throw new NotFoundException();

    Object.assign(pedido, { estadoPedido: EstadoPedido.ANULADO });

    return await this.pedidoRepository.remove(pedido);
  }
}
