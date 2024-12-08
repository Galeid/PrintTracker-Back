import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuarioService: UserService, private readonly jwtService: JwtService) {}

  async login({ username, password }: LoginDto) {
    const user = await this.usuarioService.findOneByUser(username);
    if (!user) {
      throw new UnauthorizedException('Usuario incorrecto');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: user.id, role: user.role, branch: user.branch.id };
    const token = await this.jwtService.signAsync(payload)

    return {
      token,
      role: user.role,
      branch: user.branch.name,
    };
  }
}
