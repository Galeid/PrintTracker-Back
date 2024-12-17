import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

import { LoginDto } from './dto/login.dto';
import { PayloadDto } from './dto/payload.dto';
import { SessionDto } from './dto/session.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: LoginDto): Promise<SessionDto> {
    const user = await this.userService.findOneByUser(username);
    if (!user) {
      throw new UnauthorizedException('Incorrect username');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload: PayloadDto = {
      sub: user.id,
      role: user.role,
      branch: user.branch.id,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      role: user.role,
      branch: user.branch.name,
      lockDate: user.branch.lockDate,
    };
  }
}
