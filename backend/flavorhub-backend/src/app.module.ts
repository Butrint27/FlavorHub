import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RepositoryModule } from './repository/repository.module';
import { LikesModule } from './likes/likes.module';
import { FollowersModule } from './followers/followers.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'bajrami27',
      database: 'flavorhub',
      autoLoadEntities: true,
      synchronize: false,
    }),
    UserModule,
    RepositoryModule,
    LikesModule,
    FollowersModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
