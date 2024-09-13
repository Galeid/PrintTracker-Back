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
import { Registro } from './registro/entities/registro.entity';
import { Usuario } from './usuario/entities/usuario.entity';

import { CajaModule } from './caja/caja.module';
import { ClienteModule } from './cliente/cliente.module';
import { GastoModule } from './gasto/gasto.module';
import { PedidoModule } from './pedido/pedido.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { RegistroModule } from './registro/registro.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

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
        entities: [Usuario, Cliente, Proveedor, Caja, Gasto, Pedido, Registro],
        synchronize: true,
      }),
    }),
    CajaModule,
    ClienteModule,
    GastoModule,
    PedidoModule,
    ProveedorModule,
    RegistroModule,
    UsuarioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
