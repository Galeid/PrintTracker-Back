import { Module } from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { RegistrosController } from './registros.controller';
import { Registro } from './entities/registro.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Caja } from '../caja/entities/caja.entity';
import { CajaService } from '../caja/caja.service';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Gasto } from '../gastos/entities/gasto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registro,Usuario,Caja,Pedido,Gasto])],
  controllers: [RegistrosController],
  providers: [RegistrosService,CajaService],
})
export class RegistrosModule {}
