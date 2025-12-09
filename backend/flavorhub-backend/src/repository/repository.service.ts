import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Create new repository
  async create(createDto: CreateRepositoryDto): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id: createDto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const repo = this.repoRepo.create({ ...createDto, user });
    const savedRepo = await this.repoRepo.save(repo);

    return { ...savedRepo, userId: user.id };
  }

  // Get all repositories
  async findAll(): Promise<any[]> {
  const repos = await this.repoRepo.find({ relations: ['user'] });
  return repos.map(r => ({
    id: r.id,
    title: r.title,
    dishType: r.dishType,
    ingredience: r.ingredience,
    description: r.description,
    userId: r.user?.id,   // ✅ ensure userId is sent
    image: r.image,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  }));
  }

  // Get repository by ID
  async findOne(id: number): Promise<any> {
    const repo = await this.repoRepo.findOne({ where: { id }, relations: ['user'] });
    if (!repo) throw new NotFoundException('Repository not found');
    return { ...repo, userId: repo.user?.id };
  }

  // Update repository by ID
  async update(id: number, updateDto: UpdateRepositoryDto): Promise<any> {
    const repo = await this.repoRepo.findOne({ where: { id }, relations: ['user'] });
    if (!repo) throw new NotFoundException('Repository not found');

    if (updateDto.userId) {
      const user = await this.userRepo.findOne({ where: { id: updateDto.userId } });
      if (!user) throw new NotFoundException('User not found');
      repo.user = user;
    }

    Object.assign(repo, updateDto);
    const updatedRepo = await this.repoRepo.save(repo);
    return { ...updatedRepo, userId: updatedRepo.user?.id };
  }

  // Delete repository by ID
  async remove(id: number): Promise<void> {
    const repo = await this.repoRepo.findOne({ where: { id }, relations: ['user'] });
    if (!repo) throw new NotFoundException('Repository not found');
    await this.repoRepo.remove(repo);
  }

  // Get all repositories for a specific user
  async findByUserId(userId: number): Promise<any[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const repos = await this.repoRepo.find({ where: { user: { id: userId } }, relations: ['user'] });
    return repos.map(r => ({ ...r, userId: r.user?.id }));
  }

  // Update repository for a specific user
  async updateRepoByUserId(userId: number, repositoryId: number, updateDto: UpdateRepositoryDto): Promise<any> {
    const repo = await this.repoRepo.findOne({ where: { id: repositoryId, user: { id: userId } }, relations: ['user'] });
    if (!repo) throw new NotFoundException('Repository not found for this user');

    Object.assign(repo, updateDto);
    const updatedRepo = await this.repoRepo.save(repo);
    return { ...updatedRepo, userId: updatedRepo.user?.id };
  }

  // Delete repository for a specific user
  async deleteRepoByUserId(userId: number, repositoryId: number): Promise<void> {
    const repo = await this.repoRepo.findOne({ where: { id: repositoryId, user: { id: userId } }, relations: ['user'] });
    if (!repo) throw new NotFoundException('Repository not found for this user');
    await this.repoRepo.remove(repo);
  }
}




