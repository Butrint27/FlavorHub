import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from './entities/repository.entity';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Repository)
    private readonly repoRepo: TypeOrmRepository<Repository>,

    @InjectRepository(User)
    private readonly userRepo: TypeOrmRepository<User>,
  ) {}

  async create(createDto: CreateRepositoryDto): Promise<Repository> {
    const user = await this.userRepo.findOne({ where: { id: createDto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const repo = this.repoRepo.create({
      ...createDto,
      user,
    });

    return this.repoRepo.save(repo);
  }

  async findAll(): Promise<Repository[]> {
    return this.repoRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Repository> {
    const repo = await this.repoRepo.findOne({ where: { id }, relations: ['user'] });
    if (!repo) throw new NotFoundException('Repository not found');
    return repo;
  }

  async update(id: number, updateDto: UpdateRepositoryDto): Promise<Repository> {
    const repo = await this.findOne(id);

    if (updateDto.userId) {
      const user = await this.userRepo.findOne({ where: { id: updateDto.userId } });
      if (!user) throw new NotFoundException('User not found');
      repo.user = user;
    }

    Object.assign(repo, updateDto);
    return this.repoRepo.save(repo);
  }

  async remove(id: number): Promise<void> {
    const repo = await this.findOne(id);
    await this.repoRepo.remove(repo);
  }
}


