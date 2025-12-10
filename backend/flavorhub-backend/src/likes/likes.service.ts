import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/likes/entities/like.entity';
import { Repository } from 'src/repository/entities/repository.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository as TypeOrmRepository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: TypeOrmRepository<Like>,

    @InjectRepository(Repository)
    private readonly repoRepo: TypeOrmRepository<Repository>,
  
    @InjectRepository(User)
    private readonly userRepo: TypeOrmRepository<User>,  
  ) {}


 async create(createLikeDto: CreateLikeDto): Promise<Like> {
  const { userId, repositoryId, isLiked } = createLikeDto;

  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const repository = await this.repoRepo.findOne({ where: { id: repositoryId } });
  if (!repository) throw new Error('Repository not found');

  let like = await this.likeRepo.findOne({ 
    where: { user: { id: userId }, repository: { id: repositoryId } } 
  });

  if (!like) {
    like = this.likeRepo.create({
      user,
      repository,
      isLiked, 
    });
  } else {
    like.isLiked = isLiked;
  }

  return this.likeRepo.save(like);
 }


  async findAll(): Promise<Like[]> {
    return this.likeRepo.find({ relations: ['user', 'repository'] });
  }

  async findOne(id: number): Promise<Like> {
    const like = await this.likeRepo.findOne({ where: { id }, relations: ['user', 'repository'] });
    if (!like) throw new Error('Like not found');
    return like;
  }

  async findLikesByUserId(userId: number): Promise<Like[]> {
    return this.likeRepo.find({ where: { userId }, relations: ['repository'] });
  }

  async update(id: number, updateLikeDto: UpdateLikeDto): Promise<Like> {
    const like = await this.findOne(id);

    if (updateLikeDto.userId) {
      const user = await this.userRepo.findOne({ where: { id: updateLikeDto.userId } });
      if (!user) throw new Error('User not found');
      like.user = user;
    }

    if (updateLikeDto.repositoryId) {
      const repository = await this.repoRepo.findOne({ where: { id: updateLikeDto.repositoryId } });
      if (!repository) throw new Error('Repository not found');
      like.repository = repository;
    }

    Object.assign(like, updateLikeDto);
    return this.likeRepo.save(like);
  }

 async updateLikeByUserId(userId: number, updateLikeDto: UpdateLikeDto): Promise<Like> {
  if (!updateLikeDto.repositoryId) throw new Error('repositoryId is required to identify the like');

  let like = await this.likeRepo.findOne({
    where: { userId, repository: { id: updateLikeDto.repositoryId } },
    relations: ['user', 'repository']
  });

  if (!like) throw new Error('Like not found for this user and repository');

  if (updateLikeDto.isLiked !== undefined) like.isLiked = updateLikeDto.isLiked;

  return this.likeRepo.save(like);
}


  async remove(id: number): Promise<void> {
    const like = await this.findOne(id);
    await this.likeRepo.remove(like);
  }
}
