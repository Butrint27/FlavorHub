import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from './entities/repository.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Repository, User]), // <-- must include entities used with @InjectRepository
  ],
  controllers: [RepositoryController],
  providers: [RepositoryService],
})
export class RepositoryModule {}
