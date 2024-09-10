import { Module } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { GastosController } from './gastos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { CajaService } from '../caja/caja.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Caja } from '../caja/entities/caja.entity';
import { Proveedor } from '../proveedor/entities/proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto,Usuario,Caja,Proveedor])],
  controllers: [GastosController],
  providers: [GastosService,CajaService],
})
export class GastosModule {}
