import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Caja } from './caja/entities/caja.entity';
import { Cliente } from './cliente/entities/cliente.entity';
import { Gasto } from './gasto/entities/gasto.entity';
import { Pedido } from './pedido/entities/pedido.entity';
import { Proveedor } from './proveedor/entities/proveedor.entity';
import { Sucursal } from './sucursal/entities/sucursal.entity';
import { Usuario } from './usuario/entities/usuario.entity';

import { AuthModule } from './auth/auth.module';
import { CajaModule } from './caja/caja.module';
import { ClienteModule } from './cliente/cliente.module';
import { GastoModule } from './gasto/gasto.module';
import { PedidoModule } from './pedido/pedido.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ServicioModule } from './servicio/servicio.module';
import { Servicio } from './servicio/entities/servicio.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL'),
        entities: [
          Caja,
          Cliente,
          Gasto,
          Pedido,
          Proveedor,
          Sucursal,
          Usuario,
          Servicio,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    CajaModule,
    ClienteModule,
    GastoModule,
    PedidoModule,
    ProveedorModule,
    SucursalModule,
    UsuarioModule,
    ServicioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
