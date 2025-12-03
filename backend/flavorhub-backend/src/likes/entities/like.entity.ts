import { User } from "src/user/entities/user.entity";
import { Repository } from "src/repository/entities/repository.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => User, (user) => user.like)
  user: User;

  @ManyToOne(() => Repository, (repository) => repository.like)
  repository: Repository;

  @Column()
  isLiked: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
