import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CashService } from '../cash/cash.service';
import { UserService } from '../user/user.service';
import { ClientService } from '../client/client.service';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from './enums/PaymentStatus';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private readonly usuarioService: UserService,
    private readonly clienteService: ClientService,
    private readonly cajaService: CashService,
    private readonly configService: ConfigService,
  ) {}

  cajaId = this.configService.get<string>('CAJA_ID');

  async create(createPedidoDto: CreateOrderDto) {
    const caja = await this.cajaService.findOneById(this.cajaId);
    if (!caja) throw new NotFoundException();

    caja.pendiente = parseFloat(
      (Number(caja.pendiente) + createPedidoDto.amount).toFixed(2),
    );

    if (
      new Date(createPedidoDto.date).toDateString() ===
      new Date().toDateString()
    ) {
      caja.pendienteHoy = parseFloat(
        (Number(caja.pendienteHoy) + createPedidoDto.amount).toFixed(2),
      );
    }

    await this.cajaService.update(this.cajaId, caja);

    const pedido = await this.orderRepository.create({
      ...createPedidoDto,
    });

    //pedido.usuario = await this.usuarioService.findOneById(createPedidoDto.idUsuario)
    pedido.client = await this.clienteService.findOneById(createPedidoDto.clientId)
    //pedido.caja = caja

    return await this.orderRepository.save(pedido);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        client: true,
      },
      select: {
        client: { nombre: true },
      },
      order: {
        noOrder: 'DESC'
      }
    });
  }

  async findByCliente(id:string) {
    return await this.orderRepository.find({
      where: {
        client: { id: id}
      },
      relations: {
        client: true,
      },
      select: {
        client: { nombre: true },
      },
    });
  }

  async findOneById(id: string) {
    return await this.orderRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updatePedidoDto: UpdateOrderDto) {
    const pedido = await this.findOneById(id);
    if (!pedido) throw new NotFoundException();

    Object.assign(pedido, updatePedidoDto);

    return await this.orderRepository.save(pedido);
  }

  async remove(id: string) {
    const pedido = await this.findOneById(id);
    if (!pedido) throw new NotFoundException();

    const caja = await this.cajaService.findOneById(this.cajaId);
    if (!caja) throw new NotFoundException();

    caja.pendiente = parseFloat(
      (Number(caja.pendiente) - pedido.amount).toFixed(2),
    );

    if (
      new Date(pedido.date).toDateString() ===
      new Date().toDateString()
    ) {
      caja.pendienteHoy = parseFloat(
        (Number(caja.pendienteHoy) - pedido.amount).toFixed(2),
      );
    }

    await this.cajaService.update(this.cajaId, caja);

    Object.assign(pedido, { estadoPago: PaymentStatus.CANCELLED });

    return await this.orderRepository.save(pedido);
  }

  async pay(id: string) {
    const pedido = await this.findOneById(id);
    if (!pedido) throw new NotFoundException();

    const caja = await this.cajaService.findOneById(this.cajaId);
    if (!caja) throw new NotFoundException();
    caja.pendiente = parseFloat(
      (Number(caja.pendiente) - Number(pedido.amount)).toFixed(2),
    );

      caja.principal = parseFloat(
        (Number(caja.principal) + Number(pedido.amount)).toFixed(2),
      );
      caja.ingresos = parseFloat(
        (Number(caja.ingresos) + Number(pedido.amount)).toFixed(2),
      );

    if (
      new Date(pedido.date).toLocaleDateString() ===
      new Date().toLocaleDateString()
    ) {
      caja.pendienteHoy = parseFloat(
        (Number(caja.pendienteHoy) - Number(pedido.amount)).toFixed(2),
      );
    } else {
      caja.pasadosPagados = parseFloat(
        (Number(caja.pasadosPagados) + Number(pedido.amount)).toFixed(2),
      );
    }

    await this.cajaService.update(this.cajaId, caja);

    pedido.paymentStatus = PaymentStatus.PAID;
    pedido.paymentDate = new Date();

    return await this.orderRepository.save(pedido);
  }
}
