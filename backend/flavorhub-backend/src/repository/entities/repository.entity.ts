import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Repository {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   title: string;

   @Column()
   dishType: string;

   @Column()
   ingredience: string;

   @Column({ type: 'longblob', nullable: true })
   image?: Buffer;

   @Column()
   description: string;

   @ManyToOne(() => User, (user) => user.repository)
   user: User

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   createdAt: Date;

   @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
   })
   updatedAt: Date;

}
