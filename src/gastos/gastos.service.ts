import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Gasto } from './entities/gasto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Proveedor } from '../proveedor/entities/proveedor.entity';
import { CajaService } from '../caja/caja.service';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,

    private readonly cajaService: CajaService
  ) {}
cajaId='8186798b-a60f-46a3-9caa-31703750b83a'
  async create(createGastoDto: CreateGastoDto) {
    const caja = await this.cajaService.findOne(this.cajaId)
    if (!caja) throw new NotFoundException();
    if (createGastoDto.pago === 'efectivo') {
      caja.efectivo = parseFloat((Number(caja.efectivo) - createGastoDto.monto).toFixed(2))
    } else {
      caja.cuenta = parseFloat((Number(caja.cuenta) - createGastoDto.monto).toFixed(2))
    }

    if (new Date(createGastoDto.fecha).toDateString() === new Date().toDateString()) {
      if (createGastoDto.pago === 'efectivo') {
        caja.gastosEfectivoTD = parseFloat((Number(caja.gastosEfectivoTD) + createGastoDto.monto).toFixed(2))
      } else {
        caja.gastosCuentaTD = parseFloat((Number(caja.gastosCuentaTD) + createGastoDto.monto).toFixed(2))
      }
    }

    await this.cajaService.update(this.cajaId, caja)

    const gasto = await this.gastoRepository.create({
      ...createGastoDto, tipoPago: createGastoDto.pago
    });

    gasto.usuario = await this.usuarioRepository.findOne({where: {id:createGastoDto.idUsuario}})
    gasto.proveedor = await this.proveedorRepository.findOne({where: {id:createGastoDto.idProveedor}})

    return await this.gastoRepository.save(gasto);
  }

  async findAll() {
    return await this.gastoRepository.find({
      relations:{
        proveedor:true
      },
      select:{
      proveedor: {nombre:true},
    }});
  }

  async findOne(id: string) {
    return await this.gastoRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.findOne(id);
    if (!gasto) throw new NotFoundException();

    Object.assign(gasto, updateGastoDto);

    return await this.gastoRepository.save(gasto);
  }

  async remove(id: string) {
    const gasto = await this.findOne(id);
    if (!gasto) throw new NotFoundException();

    if (new Date(gasto.fecha).getDay() == new Date().getDay()) {
      return await this.gastoRepository.remove(gasto);
    } else return {}
  }
}
