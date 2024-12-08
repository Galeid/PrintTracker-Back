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

    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly cashService: CashService,
    private readonly configService: ConfigService,
  ) {}

  cashId = this.configService.get<string>('CAJA_ID');

  async create(createOrderDto: CreateOrderDto) {
    const cash = await this.cashService.findOneById(this.cashId);
    if (!cash) throw new NotFoundException();

    cash.pending = parseFloat(
      (Number(cash.pending) + createOrderDto.amount).toFixed(2),
    );

    if (
      new Date(createOrderDto.date).toDateString() ===
      new Date().toDateString()
    ) {
      cash.todayPendings = parseFloat(
        (Number(cash.todayPendings) + createOrderDto.amount).toFixed(2),
      );
    }

    await this.cashService.update(this.cashId, cash);

    const order = await this.orderRepository.create({
      ...createOrderDto,
    });

    //pedido.usuario = await this.usuarioService.findOneById(createPedidoDto.idUsuario)
    order.client = await this.clientService.findOneById(createOrderDto.clientId)
    //pedido.caja = caja

    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        client: true,
      },
      select: {
        client: { name: true },
      },
      order: {
        noOrder: 'DESC'
      }
    });
  }

  async findByClient(id:string) {
    return await this.orderRepository.find({
      where: {
        client: { id: id}
      },
      relations: {
        client: true,
      },
      select: {
        client: { name: true },
      },
    });
  }

  async findOneById(id: string) {
    return await this.orderRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOneById(id);
    if (!order) throw new NotFoundException();

    Object.assign(order, updateOrderDto);

    return await this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.findOneById(id);
    if (!order) throw new NotFoundException();

    const cash = await this.cashService.findOneById(this.cashId);
    if (!cash) throw new NotFoundException();

    cash.pending = parseFloat(
      (Number(cash.pending) - order.amount).toFixed(2),
    );

    if (
      new Date(order.date).toDateString() ===
      new Date().toDateString()
    ) {
      cash.todayPendings = parseFloat(
        (Number(cash.todayPendings) - order.amount).toFixed(2),
      );
    }

    await this.cashService.update(this.cashId, cash);

    Object.assign(order, { estadoPago: PaymentStatus.CANCELLED });

    return await this.orderRepository.save(order);
  }

  async pay(id: string) {
    const order = await this.findOneById(id);
    if (!order) throw new NotFoundException();

    const cash = await this.cashService.findOneById(this.cashId);
    if (!cash) throw new NotFoundException();
    cash.pending = parseFloat(
      (Number(cash.pending) - Number(order.amount)).toFixed(2),
    );

      cash.main = parseFloat(
        (Number(cash.main) + Number(order.amount)).toFixed(2),
      );
      cash.income = parseFloat(
        (Number(cash.income) + Number(order.amount)).toFixed(2),
      );

    if (
      new Date(order.date).toLocaleDateString() ===
      new Date().toLocaleDateString()
    ) {
      cash.todayPendings = parseFloat(
        (Number(cash.todayPendings) - Number(order.amount)).toFixed(2),
      );
    } else {
      cash.pastPaid = parseFloat(
        (Number(cash.pastPaid) + Number(order.amount)).toFixed(2),
      );
    }

    await this.cashService.update(this.cashId, cash);

    order.paymentStatus = PaymentStatus.PAID;
    order.paymentDate = new Date();

    return await this.orderRepository.save(order);
  }
}
