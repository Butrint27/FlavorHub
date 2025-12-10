import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'src/repository/entities/repository.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: TypeOrmRepository<Comment>,

    @InjectRepository(User)
    private readonly userRepo: TypeOrmRepository<User>,

    @InjectRepository(Repository)
    private readonly repoRepo: TypeOrmRepository<Repository>,
  ) {}

  // CREATE
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { userId, repositoryId, content } = createCommentDto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const repository = await this.repoRepo.findOne({ where: { id: repositoryId } });
    if (!repository) throw new NotFoundException('Repository not found');

    const comment = this.commentRepo.create({ user, repository, userId, repositoryId, content });
    return this.commentRepo.save(comment);
  }

  // READ ALL
  async findAll(): Promise<Comment[]> {
    return this.commentRepo.find({ relations: ['user', 'repository'], order: { createdAt: 'ASC' } });
  }

  // READ ONE
  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id }, relations: ['user', 'repository'] });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  // READ BY REPOSITORY ID
  async findByRepoId(repositoryId: number): Promise<Comment[]> {
    const comments = await this.commentRepo.find({
      where: { repositoryId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    if (!comments || comments.length === 0) {
      throw new NotFoundException(`No comments found for repository ${repositoryId}`);
    }

    return comments;
  }

  // UPDATE
  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    Object.assign(comment, updateCommentDto);
    return this.commentRepo.save(comment);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    await this.commentRepo.remove(comment);
  }
}

