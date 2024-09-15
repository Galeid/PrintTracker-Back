import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';

import { Registro } from './entities/registro.entity';
import { Pedido } from '../pedido/entities/pedido.entity';
import { Gasto } from '../gasto/entities/gasto.entity';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';
import { CajaService } from '../caja/caja.service';
import { UsuarioService } from '../usuario/usuario.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegistroService {
  constructor(
    @InjectRepository(Registro)
    private registroRepository: Repository<Registro>,

    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,

    @InjectRepository(Gasto)
    private gastoRepository: Repository<Pedido>,

    private readonly usuarioService: UsuarioService,
    private readonly cajaService: CajaService,
    private readonly configService: ConfigService,
  ) {}

  cajaId = this.configService.get<string>('CAJA_ID');

  async create(createRegistroDto: CreateRegistroDto) {
    const caja = await this.cajaService.findOneById(this.cajaId);
    if (!caja) throw new NotFoundException();

    let ingresosCuentaTotal = Number(caja.cuentaHoy) - 0;
    let ingresosEfectivoTotal = Number(caja.efectivoHoy) - 0;
    let gastosCuentaTotal = Number(caja.gastoCuentaHoy) - 0;
    let gastosEfectivoTotal = Number(caja.gastoEfectivoHoy) - 0;
    let pendientesHoy = Number(caja.pendienteHoy) - 0;
    let pasadosPagados = Number(caja.pasadosPagadosHoy) - 0;

    let cuentaFinal = Number(caja.cuenta);
    let efectivoFinal = Number(caja.efectivo);
    let pendienteFinal = Number(caja.pendiente);

    let cuentaInicial =
      Number(caja.cuenta) - Number(caja.cuentaHoy) + Number(caja.gastoCuentaHoy);
    let efectivoInicial =
      Number(caja.efectivo) -
      Number(caja.efectivoHoy) +
      Number(caja.gastoEfectivoHoy);
    let pendienteInicial = Number(caja.pendiente) - Number(caja.pendienteHoy);

    let nroPedidos: number = await this.pedidoRepository.count({
      where: {
        fecha: Between(
          new Date(new Date(createRegistroDto.fecha).setHours(0, 0, 0, 0)),
          new Date(new Date(createRegistroDto.fecha).setHours(23, 59, 59, 0)),
        ),
      },
    });
    let nroGastos: number = await this.gastoRepository.count({
      where: {
        fecha: Between(
          new Date(new Date(createRegistroDto.fecha).setHours(0, 0, 0, 0)),
          new Date(new Date(createRegistroDto.fecha).setHours(23, 59, 59, 0)),
        ),
      },
    });
    let nroPedidosPendientes: number = await this.pedidoRepository.count({
      where: {
        fecha: Between(
          new Date(new Date(createRegistroDto.fecha).setHours(0, 0, 0, 0)),
          new Date(new Date(createRegistroDto.fecha).setHours(23, 59, 59, 0)),
        ),
        fechaPago: IsNull(),
      },
    });
    let nroPasadosPagados: number = await this.pedidoRepository.count({
      where: {
        fecha: Not(
          Between(
            new Date(new Date(createRegistroDto.fecha).setHours(0, 0, 0, 0)),
            new Date(new Date(createRegistroDto.fecha).setHours(23, 59, 59, 0)),
          ),
        ),
        fechaPago: Between(
          new Date(new Date(createRegistroDto.fecha).setHours(0, 0, 0, 0)),
          new Date(new Date(createRegistroDto.fecha).setHours(23, 59, 59, 0)),
        ),
      },
    });

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
      nroPasadosPagados,
      ingresosCuentaTotal,
      ingresosEfectivoTotal,
      gastosCuentaTotal,
      gastosEfectivoTotal,
      pendientesHoy,
      pasadosPagados,
    };
    const registro = await this.registroRepository.create({
      ...registroToCreate,
    });

    caja.cuentaHoy = 0;
    caja.efectivoHoy = 0;
    caja.gastoCuentaHoy = 0;
    caja.gastoEfectivoHoy = 0;
    caja.pendienteHoy = 0;
    caja.pasadosPagadosHoy = 0;

    registro.usuario = await this.usuarioService.findOneById(createRegistroDto.idUsuario)
    registro.caja = await this.cajaService.update(this.cajaId, caja);

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
