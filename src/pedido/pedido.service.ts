import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EstadoPago, EstadoPedido, Pedido, TipoPago } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CajaService } from '../caja/caja.service';
import { UsuarioService } from '../usuario/usuario.service';
import { ClienteService } from '../cliente/cliente.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,

    private readonly usuarioService: UsuarioService,
    private readonly clienteService: ClienteService,
    private readonly cajaService: CajaService,
    private readonly configService: ConfigService,
  ) {}

  cajaId = this.configService.get<string>('CAJA_ID');

  async create(createPedidoDto: CreatePedidoDto) {
    const caja = await this.cajaService.findOneById(this.cajaId);
    if (!caja) throw new NotFoundException();

    caja.pendiente = parseFloat(
      (Number(caja.pendiente) + createPedidoDto.monto).toFixed(2),
    );

    if (
      new Date(createPedidoDto.fecha).toDateString() ===
      new Date().toDateString()
    ) {
      caja.pendienteHoy = parseFloat(
        (Number(caja.pendienteHoy) + createPedidoDto.monto).toFixed(2),
      );
    }

    await this.cajaService.update(this.cajaId, caja);

    const pedido = await this.pedidoRepository.create({
      ...createPedidoDto,
    });

    pedido.usuario = await this.usuarioService.findOneById(createPedidoDto.idUsuario)
    pedido.cliente = await this.clienteService.findOneById(createPedidoDto.idCliente)
    pedido.caja = caja

    return await this.pedidoRepository.save(pedido);
  }

  async findAll() {
    return await this.pedidoRepository.find({
      relations: {
        cliente: true,
      },
      select: {
        cliente: { nombre: true },
      },
      order: {
        nroPedido: 'DESC'
      }
    });
  }

  async findByCliente(id:string) {
    return await this.pedidoRepository.find({
      where: {
        cliente: { id: id}
      },
      relations: {
        cliente: true,
      },
      select: {
        cliente: { nombre: true },
      },
    });
  }

  async findOneById(id: string) {
    return await this.pedidoRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.findOneById(id);
    if (!pedido) throw new NotFoundException();

    Object.assign(pedido, updatePedidoDto);

    return await this.pedidoRepository.save(pedido);
  }

  async remove(id: string) {
    const pedido = await this.findOneById(id);
    if (!pedido) throw new NotFoundException();

    Object.assign(pedido, { estadoPedido: EstadoPedido.ANULADO });

    return await this.pedidoRepository.remove(pedido);
  }

  async pay(id: string, tipoPago: TipoPago) {
    const pedido = await this.findOneById(id);
    if (!pedido) throw new NotFoundException();

    const caja = await this.cajaService.findOneById(this.cajaId);
    if (!caja) throw new NotFoundException();
    caja.pendiente = parseFloat(
      (Number(caja.pendiente) - Number(pedido.monto)).toFixed(2),
    );
    if (tipoPago === 'efectivo') {
      caja.efectivo = parseFloat(
        (Number(caja.efectivo) + Number(pedido.monto)).toFixed(2),
      );
      caja.efectivoHoy = parseFloat(
        (Number(caja.efectivoHoy) + Number(pedido.monto)).toFixed(2),
      );
    } else {
      caja.cuenta = parseFloat(
        (Number(caja.cuenta) + Number(pedido.monto)).toFixed(2),
      );
      caja.cuentaHoy = parseFloat(
        (Number(caja.cuentaHoy) + Number(pedido.monto)).toFixed(2),
      );
    }

    if (
      new Date(pedido.fecha).toLocaleDateString() ===
      new Date().toLocaleDateString()
    ) {
      caja.pendienteHoy = parseFloat(
        (Number(caja.pendienteHoy) - Number(pedido.monto)).toFixed(2),
      );
    } else {
      caja.pasadosPagadosHoy = parseFloat(
        (Number(caja.pasadosPagadosHoy) + Number(pedido.monto)).toFixed(2),
      );
    }

    await this.cajaService.update(this.cajaId, caja);

    pedido.tipoPago = tipoPago;
    pedido.estadoPago = EstadoPago.PAGADO;
    pedido.fechaPago = new Date();

    return await this.pedidoRepository.save(pedido);
  }
}
