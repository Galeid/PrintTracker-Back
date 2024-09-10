import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async login(username, password) {
    const userFound = await this.usuarioRepository.findOne({
      where: { usuario: username },
      select: ['id', 'usuario', 'contrasena'],
    });
    if (!userFound || userFound.contrasena !== password) {
      return null;
    } else {
      return userFound;
    }
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuarioRepository.create({
      ...createUsuarioDto,
      estado: true,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOne(id: string) {
    return await this.usuarioRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    if (!usuario) throw new NotFoundException();

    Object.assign(usuario, updateUsuarioDto);

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string) {
    const usuario = await this.findOne(id);
    if (!usuario) throw new NotFoundException();

    Object.assign(usuario, { estado: false });

    return await this.usuarioRepository.save(usuario);
  }
}
