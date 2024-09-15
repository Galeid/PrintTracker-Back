import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Registro } from './entities/registro.entity';
import { Pedido } from '../pedido/entities/pedido.entity';
import { Gasto } from '../gasto/entities/gasto.entity';
import { RegistroService } from './registro.service';
import { RegistroController } from './registro.controller';
import { CajaModule } from '../caja/caja.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registro, Pedido, Gasto]),
    CajaModule,
    UsuarioModule,
    ConfigModule,
  ],
  controllers: [RegistroController],
  providers: [RegistroService],
})
export class RegistroModule {}
