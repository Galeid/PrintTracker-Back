import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gasto } from './entities/gasto.entity';
import { CajaService } from '../caja/caja.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { ProveedorService } from '../proveedor/proveedor.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GastoService {
  constructor(
    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,

    private readonly usuarioService: UsuarioService,
    private readonly proveedorService: ProveedorService,
    private readonly cajaService: CajaService,
    private readonly configService: ConfigService,
  ) {}

  cajaId = this.configService.get<string>('CAJA_ID');

  async create(createGastoDto: CreateGastoDto) {
    const caja = await this.cajaService.findOneById(this.cajaId);
    if (!caja) throw new NotFoundException();
    if (createGastoDto.tipoPago === 'efectivo') {
      caja.efectivo = parseFloat(
        (Number(caja.efectivo) - createGastoDto.monto).toFixed(2),
      );
    } else {
      caja.cuenta = parseFloat(
        (Number(caja.cuenta) - createGastoDto.monto).toFixed(2),
      );
    }

    if (
      new Date(createGastoDto.fecha).toDateString() ===
      new Date().toDateString()
    ) {
      if (createGastoDto.tipoPago === 'efectivo') {
        caja.gastoEfectivoHoy = parseFloat(
          (Number(caja.gastoEfectivoHoy) + createGastoDto.monto).toFixed(2),
        );
      } else {
        caja.gastoCuentaHoy = parseFloat(
          (Number(caja.gastoCuentaHoy) + createGastoDto.monto).toFixed(2),
        );
      }
    }

    await this.cajaService.update(this.cajaId, caja);

    const gasto = await this.gastoRepository.create({
      ...createGastoDto,
      tipoPago: createGastoDto.tipoPago,
    });

    gasto.usuario = await this.usuarioService.findOneById(
      createGastoDto.idUsuario,
    );
    gasto.proveedor = await this.proveedorService.findOneById(
      createGastoDto.idProveedor,
    );
    gasto.caja = caja;

    return await this.gastoRepository.save(gasto);
  }

  async findAll() {
    return await this.gastoRepository.find({
      relations: { proveedor: true },
      select: {
        proveedor: { nombre: true, rubro: true },
      },
    });
  }

  async findByProveedor(id:string) {
    return await this.gastoRepository.find({
      where: {
        proveedor: { id: id}
      },
      relations: { proveedor: true },
      select: {
        proveedor: { nombre: true, rubro: true },
      },
    });
  }

  async findOneById(id: string) {
    return await this.gastoRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.findOneById(id);
    if (!gasto) throw new NotFoundException();
    Object.assign(gasto, updateGastoDto);
    return await this.gastoRepository.save(gasto);
  }

  async remove(id: string) {
    const gasto = await this.findOneById(id);
    if (!gasto) throw new NotFoundException();

    if (new Date(gasto.fecha).getDay() == new Date().getDay()) {
      return await this.gastoRepository.remove(gasto);
    } else return {};
  }
}
