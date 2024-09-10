import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { CajaService } from '../caja/caja.service';
import { Caja } from '../caja/entities/caja.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido,Caja,Usuario,Cliente])],
  controllers: [PedidosController],
  providers: [PedidosService,CajaService],
})
export class PedidosModule {}
