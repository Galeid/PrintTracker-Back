import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { EstadoPago, EstadoPedido, Pedido } from './entities/pedido.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CajaService } from '../caja/caja.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,

    private readonly cajaService: CajaService
  ) {}

  cajaId='8186798b-a60f-46a3-9caa-31703750b83a'

  async create(createPedidoDto: CreatePedidoDto) {
    const caja = await this.cajaService.findOne(this.cajaId)
    if (!caja) throw new NotFoundException();
    caja.pendiente = parseFloat((Number(caja.pendiente) + createPedidoDto.monto).toFixed(2))
    if (new Date(createPedidoDto.fecha).toDateString() === new Date().toDateString()) {
      caja.pendientesTD = parseFloat((Number(caja.pendientesTD) + createPedidoDto.monto).toFixed(2))
    }

    await this.cajaService.update(this.cajaId, caja)

    const pedido = await this.pedidoRepository.create({
      ...createPedidoDto
    });

    pedido.usuario = await this.usuarioRepository.findOne({where: {id:createPedidoDto.idUsuario}})
    pedido.cliente = await this.clienteRepository.findOne({where: {id:createPedidoDto.idCliente}})

    return await this.pedidoRepository.save(pedido);
  }

  async findAll() {
    return await this.pedidoRepository.find({
      relations:{
        cliente:true
      },
      select:{
      cliente: {nombre:true},
    }});
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

  async pay(id: string) {
    const pedido = await this.findOne(id);
    if (!pedido) throw new NotFoundException();

    const caja = await this.cajaService.findOne(this.cajaId)
    if (!caja) throw new NotFoundException();
    caja.pendiente = parseFloat((Number(caja.pendiente) - Number(pedido.monto)).toFixed(2))
    if (pedido.tipoPago === 'efectivo') {
      caja.efectivo = parseFloat((Number(caja.efectivo) + Number(pedido.monto)).toFixed(2))
      caja.efectivoTD = parseFloat((Number(caja.efectivoTD) + Number(pedido.monto)).toFixed(2))
    } else {
      caja.cuenta = parseFloat((Number(caja.cuenta) + Number(pedido.monto)).toFixed(2))
      caja.cuentaTD = parseFloat((Number(caja.cuentaTD) + Number(pedido.monto)).toFixed(2))
    }

    if (new Date(pedido.fecha).toLocaleDateString() === new Date().toLocaleDateString()) {
      caja.pendientesTD = parseFloat((Number(caja.pendientesTD) - Number(pedido.monto)).toFixed(2))
    } else {
      caja.pendPagadosTD = parseFloat((Number(caja.pendPagadosTD) + Number(pedido.monto)).toFixed(2))
    }

    await this.cajaService.update(this.cajaId, caja)

    pedido.estadoPago = EstadoPago.PAGADO
    pedido.fechaPago = new Date();

    await this.pedidoRepository.save(pedido)
  }
}
