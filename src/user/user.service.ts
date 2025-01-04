import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Branch } from '../branch/entities/branch.entity';
import { BranchService } from '../branch/branch.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private branchService: BranchService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { branchId, ...rest } = createUserDto;
    const user = await this.userRepository.create({
      ...rest,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    const userBranch = await this.branchService.findOneById(branchId);
    if (!userBranch) throw new NotFoundException('Branch not found');
    user.branch = userBranch;
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({
      where: { status: true },
      select: {
        branch: {
          id: true,
          name: true,
        },
      },
      relations: { branch: true },
    });
  }

  async findOneById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: { branch: true },
      select: {
        branch: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOneByUser(username: string) {
    return await this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
        name: true,
        status: true,
        branch: {
          id: true,
          name: true,
        },
      },
      relations: {
        branch: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { branchId, password, ...rest } = updateUserDto;

    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException();

    if (password !== '') user.password = await bcrypt.hash(password, 10);

    if (branchId !== user.branch.id) {
      const userBranch = await this.branchService.findOneById(branchId);
      if (!userBranch) throw new NotFoundException('Branch not found');
      user.branch = userBranch;
    }

    Object.assign(user, rest);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    return await this.update(id, { status: false });
  }
}
