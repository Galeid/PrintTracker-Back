import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const branch = await this.branchRepository.create({
      ...createBranchDto,
    });
    return await this.branchRepository.save(branch);
  }

  async findAll() {
    return await this.branchRepository.find({
      where: { status: true },
    });
  }

  async findOne(id: string) {
    return await this.branchRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} sucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursal`;
  }
}
