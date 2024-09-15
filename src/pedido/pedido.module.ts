import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pedido } from './entities/pedido.entity';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { CajaModule } from '../caja/caja.module';
import { ClienteModule } from '../cliente/cliente.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]),
    UsuarioModule,
    ClienteModule,
    CajaModule,
    ConfigModule
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}
