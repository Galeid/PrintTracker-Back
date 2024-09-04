import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Usuario } from './usuarios/entities/usuario.entity';
import { Cliente } from './clientes/entities/cliente.entity';

import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { Proveedor } from './proveedor/entities/proveedor.entity';
import { CajaModule } from './caja/caja.module';
import { Caja } from './caja/entities/caja.entity';
import { GastosModule } from './gastos/gastos.module';
import { Gasto } from './gastos/entities/gasto.entity';
import { PedidosModule } from './pedidos/pedidos.module';
import { Pedido } from './pedidos/entities/pedido.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Usuario, Cliente, Proveedor, Caja, Gasto, Pedido],
        synchronize: true,
      }),
    }),
    UsuariosModule,
    ClientesModule,
    ProveedorModule,
    CajaModule,
    GastosModule,
    PedidosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
