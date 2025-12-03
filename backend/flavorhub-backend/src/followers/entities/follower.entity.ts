import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { User } from  'src/user/entities/user.entity';

@Entity()
@Unique(['user', 'followsUser'])
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, (user) => user.followers, { eager: true, onDelete: 'CASCADE' })
  followsUser: User;

  @CreateDateColumn()
  createdAt: Date;
}
