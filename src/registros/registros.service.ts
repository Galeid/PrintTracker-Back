import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';
import { Registro } from './entities/registro.entity';
import { Between, IsNull, Not, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CajaService } from '../caja/caja.service';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Gasto } from '../gastos/entities/gasto.entity';

@Injectable()
export class RegistrosService {
  constructor(
    @InjectRepository(Registro)
    private registroRepository: Repository<Registro>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,

    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,

    private readonly cajaService: CajaService
  ) {}

  cajaId='8186798b-a60f-46a3-9caa-31703750b83a'
  async create(createRegistroDto: CreateRegistroDto) {
    const caja = await this.cajaService.findOne(this.cajaId)
    if (!caja) throw new NotFoundException();

    let ingresosTotal = Number(caja.cuentaTD) + Number(caja.efectivoTD) - 0
    let gastosTotal = Number(caja.gastosEfectivoTD) + Number(caja.gastosCuentaTD) - 0
    let pendientesHoy = Number(caja.pendientesTD) - 0
    let pendientesPasados = Number(caja.pendPagadosTD) - 0

    let cuentaFinal = Number(caja.cuenta)
    let efectivoFinal = Number(caja.efectivo)
    let pendienteFinal = Number(caja.pendiente)

    let cuentaInicial = Number(caja.cuenta) - Number(caja.cuentaTD) + Number(caja.gastosCuentaTD)
    let efectivoInicial = Number(caja.efectivo) - Number(caja.efectivoTD) + Number(caja.gastosEfectivoTD)
    let pendienteInicial = Number(caja.pendiente) - Number(caja.pendientesTD)

    let nroPedidos:number = await this.pedidoRepository.count({
      where: {
        fecha: Between(new Date(new Date(createRegistroDto.fecha).setHours(0,0,0,0)), new Date(new Date(createRegistroDto.fecha).setHours(23,59,59,0))),
      }
    });
    let nroGastos: number = await this.gastoRepository.count({
      where: {
        fecha: Between(new Date(new Date(createRegistroDto.fecha).setHours(0,0,0,0)), new Date(new Date(createRegistroDto.fecha).setHours(23,59,59,0))),
      }
    });
    let nroPedidosPendientes: number = await this.pedidoRepository.count({
      where: {
        fecha: Between(new Date(new Date(createRegistroDto.fecha).setHours(0,0,0,0)), new Date(new Date(createRegistroDto.fecha).setHours(23,59,59,0))),
        fechaPago: IsNull()
      }
    });;
    let nroPasadosPagados: number = await this.pedidoRepository.count({
      where: {
        fecha: Not(Between(new Date(new Date(createRegistroDto.fecha).setHours(0,0,0,0)), new Date(new Date(createRegistroDto.fecha).setHours(23,59,59,0)))),
        fechaPago: Between(new Date(new Date(createRegistroDto.fecha).setHours(0,0,0,0)), new Date(new Date(createRegistroDto.fecha).setHours(23,59,59,0))),
      }
    });;

    const registroToCreate = {
      fecha: new Date(createRegistroDto.fecha),
      cuentaInicial,
      efectivoInicial,
      pendienteInicial,
      cuentaFinal,
      efectivoFinal,
      pendienteFinal,
      nroPedidos,
      nroGastos,
      nroPedidosPendientes,
      ingresosTotal,
      gastosTotal,
      pendientesHoy,
      pendientesPasados,
      nroPasadosPagados,
    }
    const registro = await this.registroRepository.create({
      ...registroToCreate
    });

    registro.usuario = await this.usuarioRepository.findOne({where: {id:createRegistroDto.idUsuario}})

    caja.cuentaTD=0
    caja.efectivoTD=0
    caja.gastosEfectivoTD=0
    caja.gastosCuentaTD=0
    caja.pendientesTD=0
    caja.pendPagadosTD=0
    await this.cajaService.update(this.cajaId, caja)

    return await this.registroRepository.save(registro);
  }

  findAll() {
    return `This action returns all registros`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registro`;
  }

  update(id: number, updateRegistroDto: UpdateRegistroDto) {
    return `This action updates a #${id} registro`;
  }

  remove(id: number) {
    return `This action removes a #${id} registro`;
  }
}
