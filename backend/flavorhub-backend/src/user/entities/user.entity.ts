import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Repository } from 'src/repository/entities/repository.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Follower } from 'src/followers/entities/follower.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'longblob', nullable: true })
  avatar?: Buffer;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Repository, (repository) => repository.user)
  repository: Repository[];

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Follower, (follower) => follower.followsUser)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.user)
  following: Follower[];
}
