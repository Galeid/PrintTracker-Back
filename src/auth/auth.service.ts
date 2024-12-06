import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuarioService: UserService, private readonly jwtService: JwtService) {}

  async login({ username, password }: LoginDto) {
    const usuario = await this.usuarioService.findOneByUsuario(username);
    if (!usuario) {
      throw new UnauthorizedException('Usuario incorrecto');
    }

    const isValid = await bcrypt.compare(password, usuario.contrasena);
    if(!isValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: usuario.id, rol: usuario.rol, sucursal: usuario.sucursal.id };
    const token = await this.jwtService.signAsync(payload)

    return {
      token,
      rol: usuario.rol,
      sucursal: usuario.sucursal.nombre,
    };
  }
}
