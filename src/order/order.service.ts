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
import { PayloadDto } from '../auth/dto/payload.dto';
import { ServiceService } from '../service/service.service';
import { BranchService } from '../branch/branch.service';
import { PayOrderDto } from './dto/pay-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private readonly userService: UserService,
    private readonly serviceService: ServiceService,
    private readonly branchService: BranchService,
    private readonly clientService: ClientService,
    private readonly cashService: CashService,
    private readonly configService: ConfigService,
  ) {}

  cashId = this.configService.get<string>('CAJA_ID');

  async create(createOrderDto: CreateOrderDto, payload: PayloadDto) {
    const cash = await this.cashService.findOneByBranch(payload);
    if (!cash) throw new NotFoundException();
    if (
      new Date(createOrderDto.date).getTime() <=
      new Date(cash.branch.lockDate).getTime()
    )
      throw new NotFoundException('Can not create orders in locked dates');

    cash.pending = parseFloat(
      (Number(cash.pending) + createOrderDto.amount).toFixed(2),
    );

    await this.cashService.update(cash.id, cash);

    const order = await this.orderRepository.create({
      ...createOrderDto,
    });
    order.user = await this.userService.findOneById(payload.sub);
    order.client = await this.clientService.findOneById(
      createOrderDto.clientId,
    );
    order.service = await this.serviceService.findOneById(
      createOrderDto.serviceId,
    );
    order.branch = await this.branchService.findOneById(payload.branch);

    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        client: true,
        service: true,
      },
      select: {
        client: { name: true },
        service: { name: true },
      },
      order: {
        noOrder: 'DESC',
      },
    });
  }

  async findByClient(id: string) {
    return await this.orderRepository.find({
      where: {
        client: { id },
      },
      relations: {
        client: true,
        service: true,
      },
      select: {
        client: { name: true },
        service: { name: true },
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

    cash.pending = parseFloat((Number(cash.pending) - order.amount).toFixed(2));

    if (new Date(order.date).toDateString() === new Date().toDateString()) {
      cash.todayPendings = parseFloat(
        (Number(cash.todayPendings) - order.amount).toFixed(2),
      );
    }

    await this.cashService.update(this.cashId, cash);

    Object.assign(order, { estadoPago: PaymentStatus.CANCELLED });

    return await this.orderRepository.save(order);
  }


  async pay(payOrderDto: PayOrderDto, payload: PayloadDto) {
    const order = await this.findOneById(payOrderDto.orderId);
    if (!order) throw new NotFoundException();
    console.log(payload)

    const cash = await this.cashService.findOneByBranch(payload);
    if (!cash) throw new NotFoundException();

    if (
      new Date(payOrderDto.paymentDate).getTime() <=
      new Date(cash.branch.lockDate).getTime()
    )
      throw new NotFoundException('Can not create orders in locked dates');

    if (
      new Date(payOrderDto.paymentDate).getTime() <
      new Date(payOrderDto.orderDate).getTime()
    )
      throw new NotFoundException('Can not create orders in locked dates');

    cash.pending = parseFloat(
      (Number(cash.pending) - Number(order.amount)).toFixed(2),
    );

    if (payOrderDto.secondary) {
      order.paymentStatus = PaymentStatus.OTHER;
      cash.secondary = parseFloat(
        (Number(cash.secondary) + Number(order.amount)).toFixed(2),
      );
    } else {
      order.paymentStatus = PaymentStatus.PAID;
      cash.main = parseFloat(
        (Number(cash.main) + Number(order.amount)).toFixed(2),
      );
    }

    await this.cashService.update(cash.id, cash);

    order.paymentDate = new Date(payOrderDto.paymentDate);

    return await this.orderRepository.save(order);
  }
}
