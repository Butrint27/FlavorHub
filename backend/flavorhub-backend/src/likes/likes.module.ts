import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'src/repository/entities/repository.entity';
import { User } from 'src/user/entities/user.entity';
import { Like } from './entities/like.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Repository, User, Like]), // <-- must include entities used with @InjectRepository
    ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
