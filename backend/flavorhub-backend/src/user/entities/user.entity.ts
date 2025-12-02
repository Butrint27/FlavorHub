import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Repository } from 'src/repository/entities/repository.entity';

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
  repository: Repository[]
}
