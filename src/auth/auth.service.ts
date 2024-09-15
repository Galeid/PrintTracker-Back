import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuarioService: UsuarioService) {}

  async login({ username, password }: LoginDto) {
    const usuario = await this.usuarioService.findOneByUsuario(username);
    if (usuario) {
      const isValid = await bcrypt.compare(password, usuario.contrasena);
      if (isValid) return usuario;
    }
    throw new UnauthorizedException('Usuario o contraseña incorrectos');
  }
}
