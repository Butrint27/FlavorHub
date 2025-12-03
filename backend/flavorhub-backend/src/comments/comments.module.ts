import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'src/repository/entities/repository.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repository, User, Comment]), // <-- must include entities used with @InjectRepository
   ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
