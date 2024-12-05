import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ServicioController } from './servicio.controller';
import { Servicio } from './entities/servicio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio])],
  controllers: [ServicioController],
  providers: [ServicioService],
})
export class ServicioModule {}
