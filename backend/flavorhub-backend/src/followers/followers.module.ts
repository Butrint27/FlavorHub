import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follower } from 'src/followers/entities/follower.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follower, User]), // <-- must include entities used with @InjectRepository
  ],
  controllers: [FollowersController],
  providers: [FollowersService],
})
export class FollowersModule {}
