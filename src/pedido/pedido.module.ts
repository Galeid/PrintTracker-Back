import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pedido } from './entities/pedido.entity';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { CajaModule } from '../caja/caja.module';
import { ClienteModule } from '../cliente/cliente.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]),
    UsuarioModule,
    ClienteModule,
    CajaModule,
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}
