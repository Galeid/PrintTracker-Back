import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Gasto } from './entities/gasto.entity';
import { GastoService } from './gasto.service';
import { GastoController } from './gasto.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { ProveedorModule } from '../proveedor/proveedor.module';
import { CajaModule } from '../caja/caja.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gasto]),
    UsuarioModule,
    ProveedorModule,
    CajaModule,
    ConfigModule,
  ],
  controllers: [GastoController],
  providers: [GastoService],
  exports: [GastoService],
})
export class GastoModule {}
