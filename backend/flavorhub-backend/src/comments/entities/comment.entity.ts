import { User } from "src/user/entities/user.entity";
import { Repository } from "src/repository/entities/repository.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.comment)
    user: User;

    @ManyToOne(() => Repository, (repository) => repository.comment)
    repository: Repository;

    @Column()
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
