import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasena: await bcrypt.hash(createUsuarioDto.contrasena, 10),
    });
    return await this.usuarioRepository.save(usuario);
  }

  async findAll() {
    return await this.usuarioRepository.find({ where: { estado: true } });
  }

  async findOneById(id: string) {
    return await this.usuarioRepository.findOne({
      where: { id },
    });
  }

  async findOneByUsuario(usuario: string) {
    return await this.usuarioRepository.findOne({
      where: { usuario },
      select: {
        id:true,
        usuario:true,
        contrasena: true,
        rol: true,
        nombre: true,
        estado: true,
      }
    });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOneById(id);
    if (!usuario) throw new NotFoundException();
    Object.assign(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string) {
    return await this.update(id, { estado: false });
  }
}
