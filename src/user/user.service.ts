import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({ where: { status: true } });
  }

  async findOneById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findOneByUsuario(username: string) {
    return await this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
        name: true,
        status: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException();
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    return await this.update(id, { status: false });
  }
}
