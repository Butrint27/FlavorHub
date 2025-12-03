import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'src/repository/entities/repository.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Repository as TypeOrmRepository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: TypeOrmRepository<Comment>,
    
    @InjectRepository(Repository)
    private readonly repoRepo: TypeOrmRepository<Repository>,
      
    @InjectRepository(User)
    private readonly userRepo: TypeOrmRepository<User>, 
  ){}
  

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { userId, repositoryId, content } = createCommentDto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const repository = await this.repoRepo.findOne({ where: { id: repositoryId } });
    if (!repository) throw new Error('Repository not found');

    const comment = this.commentRepo.create({
      user,
      repository,
      content,
    });

    return this.commentRepo.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepo.find({ relations: ['user', 'repository'] });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id }, relations: ['user', 'repository'] });
    if (!comment) throw new Error('Comment not found');
    return comment;
  }  
  
  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new Error('Comment not found');

    Object.assign(comment, updateCommentDto);
    return this.commentRepo.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new Error('Comment not found');

    await this.commentRepo.remove(comment);
  }
}
